
import {BaseAnonAuth} from "./base-anon-auth.js"
import {AccessPayload} from "../../../../types/access-payload"

export interface BaseUserAuth extends BaseAnonAuth {
	access: AccessPayload
}
