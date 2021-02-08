
import {generateRemote} from "renraku/x/remote/generate-remote.js"
import {makeJsonRequester} from "renraku/x/remote/make-json-requester.js"

import {prepareApiShapeWiredWithAuthGoblin} from "./auth/api-shape-wired-with-auth-goblin.js"

import {TokenStore2} from "../../features/auth/goblin/types/token-store2.js"

export function makeRemote({
		appId,
		apiLink,
		tokenStore,
	}: {
		appId: string
		apiLink: string
		tokenStore: TokenStore2
	}) {

	const {shape, installAuthGoblin} = prepareApiShapeWiredWithAuthGoblin({
		appId,
		tokenStore,
	})

	const remote = generateRemote({
		link: apiLink,
		shape: shape,
		requester: makeJsonRequester({
			fetch: window.fetch,
			headers: {},
		}),
	})

	const authGoblin = installAuthGoblin({
		appService: remote.auth.appService,
		loginService: remote.auth.loginService,
	})

	return {remote, authGoblin}
}
