
import {Suite} from "cynic"
import dbby from "./toolbox/dbby/dbby.test.js"
import damnId from "./toolbox/damnedb/damn-id.test.js"
import autowatcher from "./toolbox/autowatcher/autowatcher.test.js"

export default <Suite>{
	"toolbox": {
		dbby,
		damnId,
		autowatcher,
	},
	// "features": {auth},
}
