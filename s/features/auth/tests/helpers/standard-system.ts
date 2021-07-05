
import {assert} from "cynic"
import {apiLink} from "./constants.js"
import {makeLoginLink} from "../../tools/emails/make-login-link.js"
import {mockConfig} from "../../../../assembly/backend/mock-config.js"
import {configureApiForNode} from "../../../../assembly/backend/configure-api-for-node.js"

export async function standardSystem() {
	const latency = false

	const config = mockConfig({
		platformHome: "https://stage.xiome.io/",
		platformOrigins: ["https://stage.xiome.io"],
	})
	config.database = "mock-memory"
	const backend = await configureApiForNode(config)

	async function signupAndLogin({email, appLink, appId}: {
			appId: string
			email: string
			appLink: string
		}) {

		const browser = await backend.mockBrowser()
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
				loginToken: backend.emails.recallLatestLoginEmail().loginToken,
			}),
		})
		assert(
			await windowForLogin.models.authModel.getValidAccess(),
			"logged in"
		)

		return windowForLogin
	}

	return {
		backend,
		platformAppId: backend.config.platform.appDetails.appId,
		signupAndLogin,
	}
}
