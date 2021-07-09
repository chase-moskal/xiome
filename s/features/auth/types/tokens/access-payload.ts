
import {User} from "../user.js"
import {Scope} from "./scope.js"
import {Permit} from "../permit.js"

export interface AccessPayload {
	id_app: string
	origins: string[]
	user: User | undefined
	scope: Scope
	permit: Permit
	// platform: boolean
}
