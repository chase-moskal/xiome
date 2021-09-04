
import {Suite} from "cynic"
import dbby from "./toolbox/dbby/dbby.test.js"
import damnId from "./toolbox/damnedb/damn-id.test.js"
import autowatcher from "./toolbox/autowatcher/autowatcher.test.js"
import madstate from "./toolbox/madstate/madstate.test.js"

export default <Suite>{
	"toolbox": {
		madstate,
		dbby,
		damnId,
		autowatcher,
	},
	// "features": {auth},
}
