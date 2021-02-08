
import {assert} from "cynic"
import {apiLink} from "./constants.js"
import {testableSystem} from "./testable-system.js"
import {makeLoginLink} from "../../tools/emails/make-login-link.js"

export async function standardSystem() {
	const latency = false
	const {system, getLatestLoginEmail} = await testableSystem()
	
	async function signupAndLogin({email, appLink, appId}: {
			appId: string
			email: string
			appLink: string
		}) {

		const browser = await system.mockBrowser()
		const windowForSignup = await browser.mockAppWindow({
			appId,
			apiLink,
			latency,
			windowLink: appLink,
		})
		await windowForSignup.models.authModel.sendLoginLink(email)
	
		const windowForLogin = await browser.mockAppWindow({
			appId,
			apiLink,
			latency,
			windowLink: makeLoginLink({
				home: appLink,
				loginToken: getLatestLoginEmail().loginToken,
			}),
		})
		assert(
			await windowForLogin.models.authModel.getValidAccess(),
			"logged in"
		)

		return windowForLogin
	}

	return {system, getLatestLoginEmail, signupAndLogin}
}
