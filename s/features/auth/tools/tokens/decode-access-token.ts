
import {tokenDecode} from "redcrypto/dist/token-decode.js"
import {AccessPayload} from "../../types/tokens/access-payload.js"
import {AccessToken} from "../../types/tokens/access-token.js"

export const decodeAccessToken = (accessToken: AccessToken) => {
	return tokenDecode<AccessPayload>(accessToken).payload
}
