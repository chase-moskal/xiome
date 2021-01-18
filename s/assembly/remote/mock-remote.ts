
import {loopbackJsonRemote} from "renraku/x/remote/loopback-json-remote.js"
import {makeJsonHttpServelet} from "renraku/x/servelet/make-json-http-servelet.js"

import {prepareApiShapeWiredWithAuthController} from "./shape/api-shape-wired-with-auth-controller.js"

import {SystemApi} from "../types/backend/system-api.js"
import {AppToken} from "../../features/auth/auth-types.js"

export function prepareMockRemote({api, appToken}: {
		api: SystemApi
		appToken: AppToken
	}) {

	const servelet = makeJsonHttpServelet(api)
	const {shape, installAuthController} = prepareApiShapeWiredWithAuthController({appToken})

	const remote = loopbackJsonRemote<typeof api>({
		shape,
		servelet,
		link: "http://localhost:5001/",
	})

	const authController = installAuthController(remote.auth.loginService)
	return {remote, authController}
}
