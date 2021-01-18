
import {loopbackJsonRemote} from "renraku/x/remote/loopback-json-remote.js"
import {makeJsonHttpServelet} from "renraku/x/servelet/make-json-http-servelet.js"

import {prepareApiShapeWiredWithAuthController} from "./shape/api-shape-wired-with-auth-controller.js"

import {SystemApi} from "../types/backend/system-api.js"
import {AppToken} from "../../features/auth/auth-types.js"
import {TokenStore2} from "../types/frontend/auth-goblin/token-store2.js"

export function prepareMockRemote({api, appToken, tokenStore}: {
		api: SystemApi
		appToken: AppToken
		tokenStore: TokenStore2
	}) {

	const {shape, installAuthController} = prepareApiShapeWiredWithAuthController({
		appToken,
		tokenStore,
	})

	const remote = loopbackJsonRemote<typeof api>({
		shape,
		link: "http://localhost:5001/",
		servelet: makeJsonHttpServelet(api),
	})

	const authController = installAuthController(remote.auth.loginService)
	return {remote, authController}
}
