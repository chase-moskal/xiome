
import {Suite} from "cynic"
import {commonTests} from "./testing/common-tests.js"
import {technicianSystem} from "./testing/technician-system.js"

export default <Suite>{
	// "complex interactions": {
	// 	"system can boot up, create three apps, mess around": async() => {
	// 		const {system, platformToken} = await testableSystem()
	// 		const {authTopic} = system.backend.coreApi

	// 		const passkeyA = await authTopic.generatePasskeyAccount({appToken: platformToken})
	// 		const authTokensA = await authTopic.authenticateViaPasskey({appToken: platformToken}, {passkey: passkeyA})

	// 		const passkeyB = await system.backend.coreApi.authTopic.generatePasskeyAccount({appToken: platformToken})
	// 		const passkeyC = await system.backend.coreApi.authTopic.generatePasskeyAccount({appToken: platformToken})
	// 	},
	// },
	"stories": {
		"technician": {
			"common tests for technician on platform": commonTests({makeTestableSystem: technicianSystem}),
			"login to *any* app": async() => {},
			"view platform stats": true,
			"procotol zero: roll platform secrets": true,
		},
		"creator": {
			// "common tests for passkey creator on platform": commonTests({
			// 	initialize: async({system, platformToken: appToken}) => {
			// 		const {authTopic} = system.backend.coreApi
			// 		const passkey = await authTopic.generatePasskeyAccount({appToken})
			// 		system.mockNextLogin(
			// 			async() => authTopic.authenticateViaPasskey({appToken}, {passkey})
			// 		)
			// 	},
			// }),
			// "manage apps": async() => {
			// 	const {system, platformToken} = await testableSystem()
			// 	const {authTopic, appsTopic} = system.backend.coreApi

			// 	const passkey = await authTopic.generatePasskeyAccount({appToken: platformToken})
			// 	const authTokens = await authTopic.authenticateViaPasskey({appToken: platformToken}, {passkey})
			// 	assert(authTokens, "creator login")

			// 	const {accessToken} = authTokens
			// 	const {userId} = decodeAccessToken(accessToken).user

			// 	const apps = await appsTopic.listApps({appToken: platformToken, accessToken}, {userId})
			// 	assert(apps && apps.length === 0, "new creator starts with zero apps")

			// 	await appsTopic.registerApp({appToken: platformToken, accessToken}, {
			// 		userId,
			// 		appDraft: {
			// 			label: "abc123",
			// 		},
			// 	})
			// },
			"generate an admin account to login with": true,
			"no-can-do": {
				"can't view platform stats": true,
				"can't login to other creator's apps": true,
				"can't protocol zero and roll platform secrets": true,
			},
		},
		"customer": {
			"login and out of standard app": true,
			"customize profile": true,
			"fetch any profile": true,
		},
		"developer": {
			"app tokens respect origin list": true,
			"verify scoped third-party access token": true,
		},
	},
}
