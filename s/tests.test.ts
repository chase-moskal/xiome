
import {Suite, assert} from "cynic"
import dbby from "./toolbox/dbby/dbby.test.js"
import damnId from "./toolbox/damnedb/damn-id.test.js"
import autowatcher from "./toolbox/autowatcher/autowatcher.test.js"
import madstate from "./toolbox/madstate/madstate.test.js"
import videos from "./features/videos/videos.test.js"
import {assembleTestableSystem} from "./assembly/testing/assemble-testable-system.js"

export default <Suite>{
	"toolbox": {
		madstate,
		dbby,
		damnId,
		autowatcher,
	},
	// "testable system": {
	// 	async "doesn't explode"() {
	// 		const system = await assembleTestableSystem()
	// 		const {accessModel} = system.windowForApp.models
	// 		const access = await accessModel.getValidAccess()
	// 		assert(access.appId, "appId exists")
	// 	},
	// },
	"features": {
		// auth,
		videos,
	},
}
