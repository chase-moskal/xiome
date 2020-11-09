
import {Suite, assert} from "cynic"

import {tempStorage} from "../../toolbox/json-storage.js"
import {mockWholeSystem} from "../../assembly/mock-whole-system.js"
import {prepareConstrainTables} from "../../toolbox/dbby/dbby-constrain.js"

import {CoreApi} from "./core-types.js"
import {mockSignGoogleToken} from "./mock-google-tokens.js"

async function testableSystem() {
	return mockWholeSystem({storage: tempStorage()})
}

export default <Suite>{
	"technician": {
		"login and out of platform": async() => {
			const system = await testableSystem()
			const {core} = system.frontend.models
			const appToken = await system.signAppToken(system.config.platformApp)

			system.mockNextLogin(async(authTopic: CoreApi["authTopic"]) => {
				return authTopic.authenticateViaGoogle(
					{appToken},
					{googleToken: await mockSignGoogleToken({
						name: "Chase Moskal",
						avatar: "mock-avatar",
						googleId: "mock-google-id",
					})},
				)
			})

			await core.login()
			assert(core.user, "initial login")
			const {userId} = core.user

			await core.logout()
			assert(!core.user, "initial logout")

			const constrainTables = prepareConstrainTables(system.tables.core)
			const tables = constrainTables({appId: system.config.platformApp.appId})
			const count = await tables.account.count({conditions: false})
			assert(count === 1, "one account in table")
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
