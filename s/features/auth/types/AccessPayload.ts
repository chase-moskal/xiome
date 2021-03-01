import {Permit} from "./Permit.js"
import {Scope} from "./Scope.js"
import {User} from "./User.js"


export interface AccessPayload {
	user: User
	scope: Scope
	permit: Permit
}
