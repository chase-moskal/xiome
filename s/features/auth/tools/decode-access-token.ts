
import {tokenDecode} from "redcrypto/dist/token-decode.js"
import {DecodeAccessToken, AccessPayload} from "../auth-types.js"

export const decodeAccessToken: DecodeAccessToken = accessToken => {
	const data = tokenDecode<AccessPayload>(accessToken)
	const {payload, exp} = data
	const {user} = payload
	return {exp, user, accessToken}
}
