
import {Suite} from "cynic"
import {commonTests} from "./testing/common-tests.js"
import authtools from "./authtools/authtools.test.js"

export default <Suite>{
	authtools,
	"stories": {
		"technician": {
			"common": commonTests({
				initialize: async({system, rootAppToken}) => {
					system.mockNextLogin(
						async() => system.backend.coreApi.authTopic.authenticateViaPasskey(
							{appToken: rootAppToken},
							{passkey: system.technicianPasskey},
						)
					)
				},
			}),
			"login to *any* app": true,
			"view platform stats": true,
			"procotol zero: roll platform secrets": true,
		},
		"creator": {
			"common": commonTests({
				initialize: async({system, rootAppToken: appToken}) => {
					const {authTopic} = system.backend.coreApi
					const passkey = await authTopic.generatePasskeyAccount({appToken})
					system.mockNextLogin(
						async() => authTopic.authenticateViaPasskey({appToken}, {passkey})
					)
				},
			}),
			"login and out of platform": true,
			"customize profile": true,
			"register and delete apps": true,
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
