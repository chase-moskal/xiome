
import {Suite, assert, expect} from "cynic"

import {ops} from "../../../framework/ops.js"
import {find} from "../../../toolbox/dbby/dbby-mongo.js"
import {standardSystem} from "./helpers/standard-system.js"
import {appLink, platformLink} from "./helpers/constants.js"
import {creativeSignupAndLogin} from "./helpers/creative-signup-and-login.js"

const creativeEmail = "creative@chasemoskal.com"
const customerEmail = "customer@chasemoskal.com"
const appOrigin = new URL(appLink).origin

export default <Suite>{
	"sign up and login": async() => {
		await creativeSignupAndLogin(creativeEmail)
	},

	"register app": async() => {
		const {appModel} = (await creativeSignupAndLogin(creativeEmail)).models
		assert(ops.isNone(appModel.state.appRecords), "appRecords loading should start 'none'")

		await appModel.loadApps()
		assert(ops.isReady(appModel.state.appRecords), "appRecords should be finished loading")
		assert(Object.keys(ops.value(appModel.state.appRecords)).length === 0, "should start with zero apps")

		const {id_app} = await appModel.registerApp({
			home: appLink,
			label: "My App",
			origins: [appOrigin],
		})
		assert(Object.keys(ops.value(appModel.state.appRecords)).length === 1, "should now have one app")

		await expect(async() => {
			await appModel.registerApp({
				home: "badlink",
				label: "My App",
				origins: [appOrigin],
			})
		}).throws()
		assert(Object.keys(ops.value(appModel.state.appRecords)).length === 1, "should still have one app")

		await appModel.deleteApp(id_app)
		assert(Object.keys(ops.value(appModel.state.appRecords)).length === 0, "deleted app should be gone")
	},

	"register an app and login to it": async() => {
		const system = await standardSystem()
		const platformWindow = await system.signupAndLogin({
			email: creativeEmail,
			appLink: platformLink,
			id_app: system.platformAppId,
		})
		const {appModel: platformAppModel} = platformWindow.models

		const {id_app} = await platformAppModel.registerApp({
			home: appLink,
			label: "My App",
			origins: [appOrigin],
		})
		assert(Object.keys(ops.value(platformAppModel.state.appRecords)).length === 1, "should now have one app")
		const appRow = await system.backend.database.core.app.app.read(find({id_app}))
		assert(appRow, "app row must be present")
		const app = ops.value(ops.value(platformAppModel.state.appRecords)[id_app])
		assert(app, "app must be present")

		// app window 1
		await system.signupAndLogin({
			id_app: app.id_app,
			appLink: app.home,
			email: customerEmail,
		})

		// app window 2
		const badLink = "https://badexample.com/"
		await expect(async() => {
			await system.signupAndLogin({
				id_app: app.id_app,
				appLink: badLink,
				email: customerEmail,
			})
		}).throws()
	}

	// "generate an admin account to login with": true,
	// "no-can-do": {
	// 	"can't view platform stats": true,
	// 	"can't login to other creator's apps": true,
	// 	"can't protocol zero and roll platform secrets": true,
	// },
}
