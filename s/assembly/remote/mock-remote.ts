
import {loopbackJsonRemote} from "renraku/x/remote/loopback-json-remote.js"
import {makeJsonHttpServelet} from "renraku/x/servelet/make-json-http-servelet.js"

import {prepareApiShape} from "./shape/api-shape.js"
import {AppToken} from "../../features/auth/auth-types.js"

import {SystemApi} from "../types/backend/system-api.js"

export function prepareMockRemote({api, appToken}: {
		api: SystemApi
		appToken: AppToken
	}) {

	const servelet = makeJsonHttpServelet(api)
	const {shape, installAuthController} = prepareApiShape({appToken})

	const remote = loopbackJsonRemote<typeof api>({
		shape,
		servelet,
		link: "http://localhost:5001/",
	})

	installAuthController(remote.auth.loginService)
	return remote
}
