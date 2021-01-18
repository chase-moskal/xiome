
import {loopbackJsonRemote} from "renraku/x/remote/loopback-json-remote.js"
import {makeJsonHttpServelet} from "renraku/x/servelet/make-json-http-servelet.js"

import {SimpleStorage} from "../../toolbox/json-storage.js"
import {prepareApiShapeWiredWithAuthController} from "./shape/api-shape-wired-with-auth-controller.js"

import {SystemApi} from "../types/backend/system-api.js"
import {AppToken} from "../../features/auth/auth-types.js"

export function prepareMockRemote({api, appToken, storage}: {
		api: SystemApi
		appToken: AppToken
		storage: SimpleStorage
	}) {

	const {shape, installAuthController} = prepareApiShapeWiredWithAuthController({
		storage,
		appToken,
	})

	const remote = loopbackJsonRemote<typeof api>({
		shape,
		link: "http://localhost:5001/",
		servelet: makeJsonHttpServelet(api),
	})

	const authController = installAuthController(remote.auth.loginService)
	return {remote, authController}
}
