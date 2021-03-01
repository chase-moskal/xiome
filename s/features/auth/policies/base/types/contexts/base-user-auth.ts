
import {BaseAnonAuth} from "./base-anon-auth.js"
import {AccessPayload} from "../../../../types/tokens/access-payload.js"

export interface BaseUserAuth extends BaseAnonAuth {
	access: AccessPayload
}
