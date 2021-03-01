
import {BaseAnonAuth} from "./base-anon-auth.js"
import {AccessPayload} from "../../../../types/AccessPayload"

export interface BaseUserAuth extends BaseAnonAuth {
	access: AccessPayload
}
