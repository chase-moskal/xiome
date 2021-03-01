
import {User} from "../user.js"
import {Scope} from "./scope.js"
import {Permit} from "../permit.js"

export interface AccessPayload {
	user: User
	scope: Scope
	permit: Permit
}
