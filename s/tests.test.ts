
import {Suite} from "cynic"

import dbby from "./toolbox/dbby/dbby.test.js"
import debounce from "./toolbox/debounce/debounce.test.js"
import videos from "./features/videos/videos.test.js"
import damnId from "./toolbox/damnedb/damn-id.test.js"
import madstate from "./toolbox/madstate/madstate.test.js"
import autowatcher from "./toolbox/autowatcher/autowatcher.test.js"

export default <Suite>{
	"toolbox": {
		madstate,
		dbby,
		damnId,
		debounce,
		autowatcher,
	},
	"features": {
		// auth,
		videos,
	},
}
