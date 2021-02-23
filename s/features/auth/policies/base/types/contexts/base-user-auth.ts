
import {BaseAnonAuth} from "./base-anon-auth.js"
import {AccessPayload} from "../../../../auth-types.js"

export interface BaseUserAuth extends BaseAnonAuth {
	access: AccessPayload
}
