
import {Suite, assert} from "cynic"
import authtools from "./authtools/authtools.test.js"

import {testableSystem} from "./testing/testable-system.js"

export default <Suite>{
	authtools,
	"stories": {
		"technician": {
			"login and out of platform": async() => {
				const {system, rootAppToken} = await testableSystem()
				const {core} = system.frontend.models
	
				// system.mockNextLogin(
				// 	async authTopic => authTopic.authenticateViaGoogle(
				// 		{appToken: rootAppToken},
				// 		{googleToken: await mockSignGoogleToken({
				// 			name: "Chase Moskal",
				// 			avatar: "mock-avatar",
				// 			googleId: "mock-google-id",
				// 		})},
				// 	)
				// )
	
				system.mockNextLogin(
					async authTopic => authTopic.authenticateViaPasskey(
						{appToken: rootAppToken},
						{passkey: system.technicianPasskey},
					)
				)
	
				await core.login()
				assert(core.user, "initial login")
	
				await core.logout()
				assert(!core.user, "initial logout")
	
				// const constrainTables = prepareConstrainTables(system.tables.core)
				// const tables = constrainTables({appId: system.config.platform.app.appId})
				// const count = await tables.account.count({conditions: false})
				// assert(count === 1, "one account in table")
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
	},
}
