
import {tokenDecode} from "redcrypto/dist/token-decode.js"
import {AccessPayload} from "../../types/access-payload.js"
import {AccessToken} from "../../types/access-token.js"

export const decodeAccessToken = (accessToken: AccessToken) => {
	return tokenDecode<AccessPayload>(accessToken).payload
}
