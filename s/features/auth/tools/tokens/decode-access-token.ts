
import {tokenDecode} from "redcrypto/dist/token-decode.js"
import {AccessPayload} from "../../types/AccessPayload"
import {AccessToken} from "../../types/AccessToken"

export const decodeAccessToken = (accessToken: AccessToken) => {
	return tokenDecode<AccessPayload>(accessToken).payload
}
