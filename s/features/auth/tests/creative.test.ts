
import {Suite, assert} from "cynic"

import {LoginEmailDetails} from "../auth-types.js"
import {mockWholeSystem} from "../../../assembly/mock-whole-system.js"
import {creativeSignupAndLogin} from "./creative/creative-signup-and-login.js"

const apiLink = "https://api.xiom.app/"
const platformLink = "https://xiom.app/"
const appLink = "https://example.chasemoskal.com/"

const signupAndLogin = async() => creativeSignupAndLogin({
	apiLink,
	platformLink,
	email: "creative@chasemoskal.com",
})

export default <Suite>{
	"sign up and login": async() => {
		await signupAndLogin()
	},

	"register app": async() => {
		const {window} = await signupAndLogin()
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
