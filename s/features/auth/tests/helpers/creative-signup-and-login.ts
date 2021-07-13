
import {assert} from "cynic"

import {apiLink, platformLink} from "./constants.js"
import {makeLoginLink} from "../../tools/emails/make-login-link.js"
import {standardSystem} from "./standard-system.js"

export async function creativeSignupAndLogin(email: string) {
	const system = await standardSystem()
	const browser = await system.backend.mockBrowser()
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
			loginToken: system.backend.emails.recallLatestLoginEmail().loginToken,
		}),
	})

	assert(
		await windowForLogin.models.authModel.getValidAccess(),
		"creative is logged in"
	)

	return windowForLogin
}
