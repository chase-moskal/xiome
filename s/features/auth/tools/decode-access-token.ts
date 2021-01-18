
import {tokenDecode} from "redcrypto/dist/token-decode.js"
import {AccessPayload, AccessToken} from "../auth-types.js"

export const decodeAccessToken = (accessToken: AccessToken) => {
	const {payload, exp} = tokenDecode<AccessPayload>(accessToken)
	const {user} = payload
	return {exp, user, accessToken}
}
