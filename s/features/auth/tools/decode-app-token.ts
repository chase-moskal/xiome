
import {AppPayload, AppToken} from "../auth-types.js"
import {tokenDecode} from "redcrypto/dist/token-decode.js"

export const decodeAppToken = (appToken: AppToken) => {
	return tokenDecode<AppPayload>(appToken).payload
}
