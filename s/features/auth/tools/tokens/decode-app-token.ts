
import {tokenDecode} from "redcrypto/dist/token-decode.js"
import {App} from "../../types/app"
import {AppToken} from "../../types/app-token"

export const decodeAppToken = (appAccessToken: AppToken) => {
	return tokenDecode<App>(appAccessToken).payload
}
