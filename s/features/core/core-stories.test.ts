
import {Suite, assert} from "cynic"

import {tempStorage} from "../../toolbox/json-storage.js"
import {mockWholeSystem} from "../../assembly/mock-whole-system.js"
import {prepareConstrainTables} from "../../toolbox/dbby/dbby-constrain.js"

import {mockSignGoogleToken} from "./mock-google-tokens.js"

async function testableSystem() {
	let count = 0
	return mockWholeSystem({
		storage: tempStorage(),
		generateNickname: () => `Anonymous ${count++}`,
	})
}

export default <Suite>{
	"technician": {
		"login and out of platform": async() => {
			const system = await testableSystem()
			const {core} = system.frontend.models
			const appToken = await system.signAppToken(system.config.platformApp)

			system.mockNextLogin(
				async authTopic => authTopic.authenticateViaGoogle(
					{appToken},
					{googleToken: await mockSignGoogleToken({
						name: "Chase Moskal",
						avatar: "mock-avatar",
						googleId: "mock-google-id",
					})},
				)
			)

			await core.login()
			assert(core.user, "initial login")
			const user1 = core.user

			await core.logout()
			assert(!core.user, "initial logout")

			const constrainTables = prepareConstrainTables(system.tables.core)
			const tables = constrainTables({appId: system.config.platformApp.appId})
			const count = await tables.account.count({conditions: false})
			assert(count === 1, "one account in table")

			system.mockNextLogin(
				async authTopic => authTopic.authenticateViaGoogle(
					{appToken},
					{googleToken: await mockSignGoogleToken({
						name: "Chase Moskal 2",
						avatar: "mock-avatar2",
						googleId: "mock-google-id-2",
					})},
				)
			)

			await core.login()
			assert(core.user, "initial login")

			const count2 = await tables.account.count({conditions: false})
			assert(count2 === 2, "two accounts in table")
			assert(user1.userId !== core.user?.userId, "different logins should have unique user ids")
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
