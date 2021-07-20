
import {tokenDecode} from "redcrypto/dist/token-decode.js"

import {AccessPayload} from "../../types/auth-tokens.js"

export const decodeAccessToken = (accessToken: string) => {
	return tokenDecode<AccessPayload>(accessToken).payload
}
