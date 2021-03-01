import {AccessToken} from "./AccessToken.js"
import {RefreshToken} from "./RefreshToken.js"


export interface AuthTokens {
	accessToken: AccessToken
	refreshToken: RefreshToken
}
