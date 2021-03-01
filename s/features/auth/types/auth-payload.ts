
import {User} from "./user.js"
import {GetAuthContext} from "./get-auth-context.js"

export interface AuthPayload {
	user: User
	getAuthContext: GetAuthContext
}
