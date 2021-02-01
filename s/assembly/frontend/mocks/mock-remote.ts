
import {loopbackJsonRemote} from "renraku/x/remote/loopback-json-remote.js"
import {makeJsonHttpServelet} from "renraku/x/servelet/make-json-http-servelet.js"

import {prepareApiShapeWiredWithAuthGoblin} from "../api-shape-wired-with-auth-goblin.js"

import {SystemApi} from "../../types/backend/system-api.js"
import {AppToken} from "../../../features/auth/auth-types.js"
import {addMockLatency, MockLatency} from "../../../framework/add-mock-latency.js"
import {TokenStore2} from "../../../features/auth/goblin/types/token-store2.js"

export function mockRemote({
		api,
		origin,
		apiLink,
		latency,
		appToken,
		tokenStore,
	}: {
		api: SystemApi
		origin: string
		apiLink: string
		appToken: AppToken
		latency: MockLatency
		tokenStore: TokenStore2
	}) {

	const {shape, installAuthGoblin} = prepareApiShapeWiredWithAuthGoblin({
		appToken,
		tokenStore,
	})

	const remote = addMockLatency({
		latency,
		remote: loopbackJsonRemote<typeof api>({
			shape,
			link: apiLink,
			headers: {origin},
			servelet: makeJsonHttpServelet(api),
		}),
	})

	const authGoblin = installAuthGoblin(remote.auth.loginService)
	return {remote, authGoblin}
}
