
import {assert} from "cynic"

import {testableSystem} from "./testable-system.js"
import {apiLink, platformLink} from "./constants.js"
import {makeLoginLink} from "../../tools/emails/make-login-link.js"

export async function creativeSignupAndLogin(email: string) {
	const {system, getLatestLoginEmail} = await testableSystem()
	const browser = await system.mockBrowser()
	const latency = 0

	const windowForSignup = await browser.mockAppWindow({
		apiLink,
		latency,
		windowLink: platformLink,
		appToken: system.platformAppToken,
	})

	await windowForSignup.models.authModel.sendLoginLink(email)

	const windowForLogin = await browser.mockAppWindow({
		apiLink,
		appToken: system.platformAppToken,
		latency,
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
