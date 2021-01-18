
import {asShape} from "renraku/x/identities/as-shape.js"
import {Business} from "renraku/x/types/primitives/business.js"
import {_augment} from "renraku/x/types/symbols/augment-symbol.js"

import {makeAuthGoblin} from "./auth-goblin/auth-goblin.js"
import {loginTopic} from "../../../features/auth/topics/login-topic.js"

import {SystemApi} from "../../types/backend/system-api.js"
import {AppToken} from "../../../features/auth/auth-types.js"
import {AuthGoblin} from "../../types/frontend/auth-goblin/auth-goblin.js"
import {TokenStore2} from "../../types/frontend/auth-goblin/token-store2.js"

export function prepareApiShapeWiredWithAuthController({appToken, tokenStore}: {
		appToken: AppToken
		tokenStore: TokenStore2
	}) {

	let authGoblin: AuthGoblin

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

	function installAuthController(loginService: Business<ReturnType<typeof loginTopic>>) {
		authGoblin = makeAuthGoblin({
			tokenStore,
			authorize: loginService.authorize,
		})
		return authGoblin
	}

	return {shape, installAuthController}
}
