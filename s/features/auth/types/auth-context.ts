
import {User} from "./user.js"
import {AccessToken} from "./tokens/access-token.js"

export type AuthContext = {
	user: User
	exp: number
	accessToken: AccessToken
}
