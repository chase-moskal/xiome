
import {assert} from "cynic"

import {LoginEmailDetails} from "../../auth-types.js"
import {mockWholeSystem} from "../../../../assembly/mock-whole-system.js"

export async function creativeSignupAndLogin({email, apiLink, platformLink}: {
		email: string
		apiLink: string
		platformLink: string
	}) {
	let recentLoginEmail: LoginEmailDetails
	const system = await mockWholeSystem({
		sendLoginEmail: async details => {
			recentLoginEmail = details
		},
	})
	const browser = await system.mockBrowser()

	const signupWindow = await browser.mockAppWindow({
		apiLink,
		windowLink: platformLink,
		appToken: system.platformAppToken,
	})
	await signupWindow.frontend.authModel.sendLoginLink(email)

	const loginWindow = await browser.mockAppWindow({
		apiLink,
		appToken: system.platformAppToken,
		windowLink: `${platformLink}?login=${recentLoginEmail.loginToken}`,
	})

	assert((await loginWindow.frontend.authModel.getAccess()).user,
		"creative is logged in")

	return {window: loginWindow}
}
