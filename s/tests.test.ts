
import {Suite} from "cynic"
import dbby from "./toolbox/dbby/dbby.test.js"
import auth from "./features/auth/auth.test.js"
import mobbdeep from "./toolbox/mobbdeep/mobbdeep.test.js"

export default <Suite>{
	"toolbox": {dbby, mobbdeep},
	"features": {auth},
}
