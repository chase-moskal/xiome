
import {Business} from "renraku/x/types/primitives/business.js"
import {AccessToken} from "../../../features/auth/auth-types.js"
import {loginTopic} from "../../../features/auth/topics/login-topic.js"
import {AuthController} from "../../types/remote/shape/auth-controller.js"

export function makeAuthController(
		loginService: Business<ReturnType<typeof loginTopic>>
	): AuthController {

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
