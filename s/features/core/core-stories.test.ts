
import {Suite, expect} from "cynic"

import {wholeSystemTestable} from "../../assembly/whole-system-testable.js"

export default <Suite>{
	"technician": {
		"login and out of platform": async() => {
			const system = await wholeSystemTestable()
			const {core} = system.frontend.models
			await core.login()
			expect(core.user).ok()
			await core.logout()
			expect(core.user).not.ok()
			return true
		},
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
