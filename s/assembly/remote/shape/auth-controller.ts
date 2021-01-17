
import {Business} from "renraku/x/types/primitives/business.js"
import {AccessToken} from "../../../features/auth/auth-types.js"
import {loginTopic} from "../../../features/auth/topics/login-topic.js"

export function makeAuthController(
		loginService: Business<ReturnType<typeof loginTopic>>
	) {

	let accessToken: AccessToken

	// TODO implement auto token refreshing
	async function getAccessToken() {
		return accessToken
	}

	function setAccessToken(token: AccessToken) {
		accessToken = token
	}

	return {getAccessToken, setAccessToken}
}
