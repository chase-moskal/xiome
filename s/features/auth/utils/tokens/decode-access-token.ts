
import {tokenDecode} from "redcrypto/x/token-decode.js"
import {AccessPayload} from "../../types/auth-tokens.js"

export const decodeAccessToken = (accessToken: string) => {
	return tokenDecode<AccessPayload>(accessToken).data.payload
}
