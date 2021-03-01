import {User} from "./user.js"
import {AccessToken} from "./access-token.js"


export type AuthContext = {
	user: User
	exp: number
	accessToken: AccessToken
}
