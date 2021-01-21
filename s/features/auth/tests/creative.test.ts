
import {Suite, assert} from "cynic"

import {Await} from "../../../types/fancy.js"
import {LoginEmailDetails} from "../auth-types.js"
import {mockWholeSystem} from "../../../assembly/mock-whole-system.js"

const apiLink = "https://api.xiom.app/"
const platformLink = "https://xiom.app/"
const appLink = "https://example.chasemoskal.com/"

const creativeEmail = "creative@chasemoskal.com"

async function creativeSignupAndLogin() {
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
	await signupWindow.frontend.authModel.sendLoginLink(creativeEmail)

	const loginWindow = await browser.mockAppWindow({
		apiLink,
		appToken: system.platformAppToken,
		windowLink: `${platformLink}?login=${recentLoginEmail.loginToken}`,
	})

	assert((await loginWindow.frontend.authModel.getAccess()).user,
		"creative is logged in")

	return {window: loginWindow}
}

export default <Suite>{
	"sign up and login": async() => {
		await creativeSignupAndLogin()
	},

	"register app": async() => {
		const {window} = await creativeSignupAndLogin()
		await window.frontend.appModel.loadAppListing()
		const {appModel} = window.frontend
		assert(appModel.appList.length === 0, "should start with zero apps")

		appModel.setAppDraft({
			home: appLink,
			label: "My App",
			origins: [new URL(appLink).origin],
		})

		await appModel.submitAppDraftForRegistration()
		assert(appModel.appList.length === 1, "should now have one app")
	},

	"generate an admin account to login with": true,
	"no-can-do": {
		"can't view platform stats": true,
		"can't login to other creator's apps": true,
		"can't protocol zero and roll platform secrets": true,
	},
}
