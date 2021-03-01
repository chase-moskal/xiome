
import {AccessToken} from "./access-token.js"
import {RefreshToken} from "./refresh-token.js"

export interface AuthTokens {
	accessToken: AccessToken
	refreshToken: RefreshToken
}
