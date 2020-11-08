
import {Suite, expect} from "cynic"

import {and} from "../../toolbox/dbby/dbby-memory.js"
import {mockWholeSystem} from "../../assembly/mock-whole-system.js"
import {prepareConstrainTables} from "../../toolbox/dbby/dbby-constrain.js"

export default <Suite>{
	"technician": {
		"login and out of platform": async() => {
			const system = await mockWholeSystem()
			const {core} = system.frontend.models

			await core.login()
			expect(core.user).ok()
			const {userId} = core.user

			await core.logout()
			expect(core.user).not.ok()

			const constrainTables = prepareConstrainTables(system.tables.core)
			const tables = constrainTables({appId: system.config.platformApp.appId})
			const count = await tables.account.count({
				conditions: and({equal: {userId}})
			})
			expect(count === 1).ok()
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
