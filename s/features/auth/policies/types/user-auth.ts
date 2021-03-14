
import {AnonAuth} from "./anon-auth.js"
import {AccessPayload} from "../../types/tokens/access-payload.js"
import {PrivilegeChecker} from "../../tools/permissions/types/privilege-checker.js"
import {appPermissions} from "../../../../assembly/backend/permissions/standard/app-permissions.js"

export interface UserAuth extends AnonAuth {
	access: AccessPayload
	checker: PrivilegeChecker<typeof appPermissions["privileges"]>
}
