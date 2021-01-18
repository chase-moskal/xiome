
import {Business} from "renraku/x/types/primitives/business.js"

import {pubsub} from "../../../toolbox/pubsub.js"
import {loginTopic} from "../../../features/auth/topics/login-topic.js"
import {decodeAccessToken} from "../../../features/auth/tools/decode-access-token.js"

import {AccessToken} from "../../../features/auth/auth-types.js"
import {isTokenExpired} from "../../../features/auth/tools/is-token-expired.js"

export function makeAuthController(
		loginService: Business<ReturnType<typeof loginTopic>>
	) {

	const {
		publish,
		subscribe: subscribeToAccessTokenChange,
	} = pubsub<(accessToken: AccessToken) => void | Promise<void>>()

	let accessToken: AccessToken

	// TODO implement auto token refreshing
	async function getAccessToken() {
		// const expired = isTokenExpired(accessToken)
		// if (expired) {
		// 	const lol = await loginService({})
		// }
		return accessToken
	}

	async function setAccessToken(token: AccessToken) {
		accessToken = token
		await publish(accessToken)
	}

	return {
		getAccessToken,
		setAccessToken,
		subscribeToAccessTokenChange,
	}
}
