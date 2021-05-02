
import {User} from "../user.js"
import {Scope} from "./scope.js"
import {Permit} from "../permit.js"

export interface AccessPayload {
	appId: string
	origins: string[]
	user: User | undefined
	scope: Scope
	permit: Permit
	// platform: boolean
}
