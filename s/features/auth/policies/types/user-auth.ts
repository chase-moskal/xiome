
import {AnonAuth} from "./anon-auth.js"
import {AccessPayload} from "../../types/tokens/access-payload.js"

export interface UserAuth extends AnonAuth {
	access: AccessPayload
}
