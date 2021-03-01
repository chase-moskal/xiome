
import {tokenDecode} from "redcrypto/dist/token-decode.js"
import {App} from "../../types/tokens/app.js"
import {AppToken} from "../../types/tokens/app-token.js"

export const decodeAppToken = (appAccessToken: AppToken) => {
	return tokenDecode<App>(appAccessToken).payload
}
