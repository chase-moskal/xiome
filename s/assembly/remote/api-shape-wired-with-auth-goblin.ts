
import {asShape} from "renraku/x/identities/as-shape.js"
import {_augment} from "renraku/x/types/symbols/augment-symbol.js"

import {loginTopic} from "../../features/auth/topics/login-topic.js"
import {makeAuthGoblin} from "../../features/auth/goblin/auth-goblin.js"
import {decodeAppToken} from "../../features/auth/tools/tokens/decode-app-token.js"

import {Service} from "../../types/service.js"
import {SystemApi} from "../types/backend/system-api.js"
import {AppToken} from "../../features/auth/auth-types.js"
import {AuthGoblin} from "../../features/auth/goblin/types/auth-goblin.js"
import {TokenStore2} from "../../features/auth/goblin/types/token-store2.js"

export function prepareApiShapeWiredWithAuthGoblin({appToken, tokenStore}: {
		appToken: AppToken
		tokenStore: TokenStore2
	}) {

	let authGoblin: AuthGoblin
	const {appId} = decodeAppToken(appToken)

	const shape = asShape<SystemApi>({
		auth: {
			loginService: {
				[_augment]: {
					getMeta: async() => ({appToken}),
				},
				authenticateViaLoginToken: true,
				authorize: true,
				sendLoginLink: true,
			},
			appService: {
				[_augment]: {
					getMeta: async() => ({
						appToken,
						accessToken: await authGoblin.getAccessToken(),
					}),
				},
				listApps: true,
				updateApp: true,
				registerApp: true,
				deleteAppToken: true,
				updateAppToken: true,
				registerAppToken: true,
			},
			personalService: {
				[_augment]: {
					getMeta: async() => ({
						appToken,
						accessToken: await authGoblin.getAccessToken(),
					}),
				},
				setProfile: true,
			},
			userService: {
				[_augment]: {
					getMeta: async() => ({
						appToken,
						accessToken: await authGoblin.getAccessToken(),
					}),
				},
				getUser: true,
			},
		},
	})

	function installAuthGoblin(loginService: Service<typeof loginTopic>) {
		authGoblin = makeAuthGoblin({
			appId,
			tokenStore,
			authorize: loginService.authorize,
		})
		return authGoblin
	}

	return {shape, installAuthGoblin}
}
