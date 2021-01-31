
import {Suite} from "cynic"
import dbby from "./toolbox/dbby/dbby.test.js"
import auth from "./features/auth/auth.test.js"

export default <Suite>{
	"toolbox": {dbby},
	"features": {auth},
}
