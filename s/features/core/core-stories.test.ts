
import {Suite, expect} from "cynic"

import {generatePasskey} from "./generate-passkey.js"
import {testableCoreApi} from "./testable-core-api.js"

export default <Suite>{
	"technician": {
		"login and out of platform": true,
		"view platform stats": true,
		"manage apps": true,
		"procotol zero: roll platform secrets": true,
	},
	"creator": {
		"login and out of platform": true,
		"customize profile": true,
		"manage apps": true,
	},
	"customer": {
		"login and out": true,
		"customize profile": true,
		"fetch any profile": true,
	},
	"developer": {
		"app tokens respect origin list": true,
		"verify scoped third-party access token": true,
	},
}
