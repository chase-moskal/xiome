
import {generateRemote} from "renraku/x/remote/generate-remote.js"
import {makeJsonRequester} from "renraku/x/remote/make-json-requester.js"

import {prepareApiShapeWiredWithAuthGoblin} from "./api-shape-wired-with-auth-goblin.js"

import {AppToken} from "../../features/auth/auth-types.js"
import {TokenStore2} from "../../features/auth/goblin/types/token-store2.js"

export function makeRemote({
		apiLink,
		appToken,
		tokenStore,
	}: {
		apiLink: string
		appToken: AppToken
		tokenStore: TokenStore2
	}) {

	const {shape, installAuthGoblin} = prepareApiShapeWiredWithAuthGoblin({
		appToken,
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

	const authGoblin = installAuthGoblin(remote.auth.loginService)
	return {remote, authGoblin}
}
