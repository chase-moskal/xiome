
import {Suite, expect} from "cynic"

import {generatePasskey} from "./generate-passkey.js"
import {testableCoreApi} from "./testable-core-api.js"

export default <Suite>{
	"technician (me)": {
		"login and out": true,
		"configure own apps": true,
		"view meta-stats": true,
		"procotol zero: roll secrets": true,
	},
	"creator": {
		"login to meta-app": true,
		"customize profile": true,
		"manage apps, tokens, admins": true,
	},
	"customer": {
		"fetch public profiles": true,
		"login and out": true,
		"customize profile": true,
	},
}
