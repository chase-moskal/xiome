
import {assert} from "cynic"

import {testableSystem} from "./testable-system.js"
import {apiLink, platformLink} from "./constants.js"
import {makeLoginLink} from "../../tools/emails/make-login-link.js"

export async function creativeSignupAndLogin(email: string) {
	const {system, getLatestLoginEmail} = await testableSystem()
	const browser = await system.mockBrowser()
	const latency = false

	const windowForSignup = await browser.mockAppWindow({
		apiLink,
		latency,
		windowLink: platformLink,
		appId: system.platformAppId,
	})

	await windowForSignup.models.authModel.sendLoginLink(email)

	const windowForLogin = await browser.mockAppWindow({
		apiLink,
		latency,
		appId: system.platformAppId,
		windowLink: makeLoginLink({
			home: platformLink,
			loginToken: getLatestLoginEmail().loginToken,
		}),
	})

	assert(
		await windowForLogin.models.authModel.getValidAccess(),
		"creative is logged in"
	)

	return windowForLogin
}
