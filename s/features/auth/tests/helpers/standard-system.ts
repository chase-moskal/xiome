
import {assert} from "cynic"
import {apiLink} from "./constants.js"
import {testableSystem} from "./testable-system.js"
import {makeLoginLink} from "../../tools/emails/make-login-link.js"

export async function standardSystem() {
	const latency = 0
	const {system, getLatestLoginEmail} = await testableSystem()
	
	async function signupAndLogin({email, appLink, appToken}: {
			email: string
			appLink: string
			appToken: string
		}) {

		const browser = await system.mockBrowser()
		const windowForSignup = await browser.mockAppWindow({
			apiLink,
			latency,
			appToken,
			windowLink: appLink,
		})
		await windowForSignup.models.authModel.sendLoginLink(email)
	
		const windowForLogin = await browser.mockAppWindow({
			apiLink,
			latency,
			appToken,
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
