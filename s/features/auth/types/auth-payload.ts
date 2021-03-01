import {GetAuthContext} from "./get-auth-context.js"
import {User} from "./user.js"


export interface AuthPayload {
	user: User
	getAuthContext: GetAuthContext
}
