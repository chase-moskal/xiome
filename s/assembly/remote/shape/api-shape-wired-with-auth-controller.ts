
import {asShape} from "renraku/x/identities/as-shape.js"
import {Business} from "renraku/x/types/primitives/business.js"
import {_augment} from "renraku/x/types/symbols/augment-symbol.js"

import {makeAuthController} from "./auth-controller.js"
import {SimpleStorage} from "../../../toolbox/json-storage.js"
import {loginTopic} from "../../../features/auth/topics/login-topic.js"

import {SystemApi} from "../../types/backend/system-api.js"
import {AppToken} from "../../../features/auth/auth-types.js"
import {AuthController} from "../../types/frontend/auth-controller.js"

export function prepareApiShapeWiredWithAuthController({appToken, storage}: {
		appToken: AppToken
		storage: SimpleStorage
	}) {

	let authController: AuthController

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
						accessToken: await authController.getAccessToken(),
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
						accessToken: await authController.getAccessToken(),
					}),
				},
				setProfile: true,
			},
			userService: {
				[_augment]: {
					getMeta: async() => ({
						appToken,
						accessToken: await authController.getAccessToken(),
					}),
				},
				getUser: true,
			},
		},
	})

	function installAuthController(loginService: Business<ReturnType<typeof loginTopic>>) {
		authController = makeAuthController({
			storage,
			authorize: loginService.authorize,
		})
		return authController
	}

	return {shape, installAuthController}
}
