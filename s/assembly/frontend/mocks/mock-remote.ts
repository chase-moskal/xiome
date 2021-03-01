
import {loopbackJsonRemote} from "renraku/x/remote/loopback-json-remote.js"
import {makeJsonHttpServelet} from "renraku/x/servelet/make-json-http-servelet.js"

import {SystemApi} from "../../backend/types/system-api.js"
import {AppToken} from "../../../features/auth/types/app-token.js"
import {TokenStore2} from "../../../features/auth/goblin/types/token-store2.js"
import {addMockLatency, MockLatency} from "../../../framework/add-mock-latency.js"
import {prepareApiShapeWiredWithAuthGoblin} from "../auth/api-shape-wired-with-auth-goblin.js"

export function mockRemote({
		api,
		appId,
		origin,
		apiLink,
		latency,
		tokenStore,
	}: {
		api: SystemApi
		origin: string
		apiLink: string
		appId: AppToken
		latency: MockLatency
		tokenStore: TokenStore2
	}) {

	const {shape, installAuthGoblin} = prepareApiShapeWiredWithAuthGoblin({
		appId,
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

	const authGoblin = installAuthGoblin({
		loginService: remote.auth.loginService,
		appTokenService: remote.auth.appTokenService,
	})

	return {remote, authGoblin}
}
