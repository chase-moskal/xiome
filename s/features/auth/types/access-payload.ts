import {Permit} from "./permit.js"
import {Scope} from "./scope.js"
import {User} from "./user.js"


export interface AccessPayload {
	user: User
	scope: Scope
	permit: Permit
}
