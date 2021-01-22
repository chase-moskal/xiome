
import {Suite, assert} from "cynic"
import {appLink} from "./helpers/constants.js"
import {creativeSignupAndLogin} from "./helpers/creative-signup-and-login.js"

const email = "creative@chasemoskal.com"

export default <Suite>{
	"sign up and login": async() => {
		await creativeSignupAndLogin(email)
	},

	"register app": async() => {
		const {appModel} = (await creativeSignupAndLogin(email)).frontend
		await appModel.loadAppListing()
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
