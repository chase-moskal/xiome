
import {tokenDecode} from "redcrypto/dist/token-decode.js"
import {AccessPayload, AccessToken} from "../../auth-types.js"

export const decodeAccessToken = (accessToken: AccessToken) => {
	return tokenDecode<AccessPayload>(accessToken).payload
}
