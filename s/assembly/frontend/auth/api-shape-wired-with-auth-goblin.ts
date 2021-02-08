
import {asShape} from "renraku/x/identities/as-shape.js"
import {_augment} from "renraku/x/types/symbols/augment-symbol.js"

import {loginTopic} from "../../../features/auth/topics/login-topic.js"
import {makeAuthGoblin} from "../../../features/auth/goblin/auth-goblin.js"

import {Service} from "../../../types/service.js"
import {SystemApi} from "../../backend/types/system-api.js"
import {appTopic} from "../../../features/auth/topics/app-topic.js"
import {AuthGoblin} from "../../../features/auth/goblin/types/auth-goblin.js"
import {TokenStore2} from "../../../features/auth/goblin/types/token-store2.js"

export function prepareApiShapeWiredWithAuthGoblin({appId, tokenStore}: {
		appId: string
		tokenStore: TokenStore2
	}) {

	let authGoblin: AuthGoblin

	const shape = asShape<SystemApi>({
		auth: {
			loginService: {
				[_augment]: {
					getMeta: async() => ({
						appToken: await authGoblin.getAppToken(),
					}),
				},
				authenticateViaLoginToken: true,
				authorize: true,
				sendLoginLink: true,
			},
			appService: {
				[_augment]: {
					getMeta: async() => ({
						appToken: await authGoblin.getAppToken(),
						accessToken: await authGoblin.getAccessToken(),
					}),
				},
				authorizeApp: true,
				listApps: true,
				deleteApp: true,
				updateApp: true,
				registerApp: true,
			},
			personalService: {
				[_augment]: {
					getMeta: async() => ({
						appToken: await authGoblin.getAppToken(),
						accessToken: await authGoblin.getAccessToken(),
					}),
				},
				setProfile: true,
			},
			userService: {
				[_augment]: {
					getMeta: async() => ({
						appToken: await authGoblin.getAppToken(),
						accessToken: await authGoblin.getAccessToken(),
					}),
				},
				getUser: true,
			},
		},
	})

	function installAuthGoblin({loginService, appService}: {
			loginService: Service<typeof loginTopic>
			appService: Service<typeof appTopic>
		}) {
		authGoblin = makeAuthGoblin({
			appId,
			tokenStore,
			authorize: loginService.authorize,
			authorizeApp: appService.authorizeApp,
		})
		return authGoblin
	}

	return {shape, installAuthGoblin}
}
