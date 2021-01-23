
import {loopbackJsonRemote} from "renraku/x/remote/loopback-json-remote.js"
import {makeJsonHttpServelet} from "renraku/x/servelet/make-json-http-servelet.js"

import {prepareApiShapeWiredWithAuthGoblin} from "../api-shape-wired-with-auth-goblin.js"

import {SystemApi} from "../../types/backend/system-api.js"
import {AppToken} from "../../../features/auth/auth-types.js"
import {TokenStore2} from "../../../features/auth/goblin/types/token-store2.js"

export function mockRemote({
		api,
		apiLink,
		appToken,
		tokenStore,
	}: {
		api: SystemApi
		apiLink: string
		appToken: AppToken
		tokenStore: TokenStore2
	}) {

	const {shape, installAuthGoblin} = prepareApiShapeWiredWithAuthGoblin({
		appToken,
		tokenStore,
	})

	const remote = loopbackJsonRemote<typeof api>({
		shape,
		link: apiLink,
		servelet: makeJsonHttpServelet(api),
	})

	const authGoblin = installAuthGoblin(remote.auth.loginService)
	return {remote, authGoblin}
}
