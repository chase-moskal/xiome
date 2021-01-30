
import {Suite, assert, expect} from "cynic"
import {appLink} from "./helpers/constants.js"
import {creativeSignupAndLogin} from "./helpers/creative-signup-and-login.js"

const email = "creative@chasemoskal.com"

export default <Suite>{
	"sign up and login": async() => {
		await creativeSignupAndLogin(email)
	},

	"register app": async() => {
		const {appModel} = (await creativeSignupAndLogin(email)).models
		assert(appModel.appListLoadingView.none, "applist loading should start 'none'")

		await appModel.loadAppList()
		assert(appModel.appListLoadingView.ready, "applist should be finished loading")
		assert(appModel.appListLoadingView.payload.length === 0, "should start with zero apps")

		await appModel.registerApp({
			home: appLink,
			label: "My App",
			origins: [new URL(appLink).origin],
		})
		assert(appModel.appListLoadingView.payload.length === 1, "should now have one app")

		await expect(async() => {
			await appModel.registerApp({
				home: "badlink",
				label: "My App",
				origins: ["https://example.chasemoskal.com"],
			})
		}).throws()
	},

	// "generate an admin account to login with": true,
	// "no-can-do": {
	// 	"can't view platform stats": true,
	// 	"can't login to other creator's apps": true,
	// 	"can't protocol zero and roll platform secrets": true,
	// },
}
