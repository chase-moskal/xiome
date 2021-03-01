
import {tokenDecode} from "redcrypto/dist/token-decode.js"
import {App, AppToken} from "../../types/auth-types.js"

export const decodeAppToken = (appAccessToken: AppToken) => {
	return tokenDecode<App>(appAccessToken).payload
}
