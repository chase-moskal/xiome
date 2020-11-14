
// import {testableSystem} from "./testable-system.js"

// export async function systemAlpha() {
// 	const {system, rootAppToken} = await testableSystem()

// 	system.mockNextLogin(
// 		async authTopic => authTopic.authenticateViaPasskey(
// 			{appToken: rootAppToken},
// 			{passkey: system.technicianPasskey},
// 		)
// 	)

// 	// system.mockNextLogin(
// 	// 	async authTopic => authTopic.authenticateViaGoogle(
// 	// 		{appToken: rootAppToken},
// 	// 		{googleToken: await mockSignGoogleToken({
// 	// 			name: "Chase Moskal",
// 	// 			avatar: "mock-avatar",
// 	// 			googleId: "mock-google-id",
// 	// 		})},
// 	// 	)
// 	// )

// 	await system.frontend.models.core.login()

// 	// TODO implement: example app registration, return apptoken

// 	// const constrainTables = prepareConstrainTables(system.tables.core)
// 	// const tables = constrainTables({appId: system.config.platform.app.appId})
// 	// const count = await tables.account.count({conditions: false})
// 	// assert(count === 1, "one account in table")
// }
