
import {tokenDecode} from "redcrypto/dist/token-decode.js"
import {AccessPayload} from "../../types/access-payload"
import {AccessToken} from "../../types/access-token"

export const decodeAccessToken = (accessToken: AccessToken) => {
	return tokenDecode<AccessPayload>(accessToken).payload
}
