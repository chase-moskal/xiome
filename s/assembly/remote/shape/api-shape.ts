
import {asShape} from "renraku/x/identities/as-shape.js"
import {Business} from "renraku/x/types/primitives/business.js"
import {_augment} from "renraku/x/types/symbols/augment-symbol.js"

import {makeAuthController} from "./auth-controller.js"
import {SystemApi} from "../../types/backend/system-api.js"
import {AppToken} from "../../../features/auth/auth-types.js"
import {loginTopic} from "../../../features/auth/topics/login-topic.js"

import {AuthController} from "../../types/remote/shape/auth-controller.js"

export function prepareApiShape({appToken}: {
		appToken: AppToken
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
		authController = makeAuthController(loginService)
		return {shape, authController}
	}

	return {
		shape,
		installAuthController,
	}
}
