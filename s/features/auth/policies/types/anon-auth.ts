
import {AuthTables} from "../../tables/types/auth-tables.js"
import {AccessPayload} from "../../types/tokens/access-payload.js"
import {PrivilegeChecker} from "../../tools/permissions/types/privilege-checker.js"
import {appPermissions} from "../../../../assembly/backend/permissions2/standard-permissions.js"

export interface AnonAuth {
	access: AccessPayload
	tables: AuthTables
	checker: PrivilegeChecker<typeof appPermissions["privileges"]>
}
