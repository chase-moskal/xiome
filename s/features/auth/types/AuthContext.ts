import {User} from "./User.js"
import {AccessToken} from "./AccessToken.js"


export type AuthContext = {
	user: User
	exp: number
	accessToken: AccessToken
}
