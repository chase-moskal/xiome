
import {tokenDecode} from "redcrypto/dist/token-decode.js"
import {App} from "../../types/App"
import {AppToken} from "../../types/AppToken"

export const decodeAppToken = (appAccessToken: AppToken) => {
	return tokenDecode<App>(appAccessToken).payload
}
