
import {assert} from "cynic"

import {testableSystem} from "./testable-system.js"
import {apiLink, platformLink} from "./constants.js"
import {makeLoginLink} from "../../tools/emails/make-login-link.js"

export async function creativeSignupAndLogin(email: string) {
	const {system, getLatestLoginEmail} = await testableSystem()
	const browser = await system.mockBrowser()

	const windowForSignup = await browser.mockAppWindow({
		apiLink,
		windowLink: platformLink,
		appToken: system.platformAppToken,
	})

	await windowForSignup.frontend.authModel.sendLoginLink(email)

	const windowForLogin = await browser.mockAppWindow({
		apiLink,
		appToken: system.platformAppToken,
		windowLink: makeLoginLink({
			home: platformLink,
			loginToken: getLatestLoginEmail().loginToken,
		}),
	})

	assert(
		await windowForLogin.frontend.authModel.getAccess(),
		"creative is logged in"
	)

	return windowForLogin
}
