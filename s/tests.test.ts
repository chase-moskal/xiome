
import {Suite} from "cynic"
import dbby from "./toolbox/dbby/dbby.test.js"
// import auth from "./features/auth/auth.test.js"
import autowatcher from "./toolbox/autowatcher/autowatcher.test.js"

export default <Suite>{
	"toolbox": {dbby, autowatcher},
	// "features": {auth},
}
