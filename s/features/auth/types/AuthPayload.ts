import {GetAuthContext} from "./GetAuthContext.js"
import {User} from "./User.js"


export interface AuthPayload {
	user: User
	getAuthContext: GetAuthContext
}
