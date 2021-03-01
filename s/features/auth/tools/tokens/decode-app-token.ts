
import {tokenDecode} from "redcrypto/dist/token-decode.js"
import {App} from "../../types/app.js"
import {AppToken} from "../../types/app-token.js"

export const decodeAppToken = (appAccessToken: AppToken) => {
	return tokenDecode<App>(appAccessToken).payload
}
