
import {asShape} from "renraku/x/identities/as-shape.js"
import {_augment} from "renraku/x/types/symbols/augment-symbol.js"

import {makeAuthGoblin} from "./auth-goblin/auth-goblin.js"
import {loginTopic} from "../../../features/auth/topics/login-topic.js"
import {decodeAppToken} from "../../../features/auth/tools/decode-app-token.js"

import {Service} from "../../../types/service.js"
import {SystemApi} from "../../types/backend/system-api.js"
import {AppToken} from "../../../features/auth/auth-types.js"
import {AuthGoblin} from "../../types/frontend/auth-goblin/auth-goblin.js"
import {TokenStore2} from "../../types/frontend/auth-goblin/token-store2.js"

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
