
import {PrivilegeDisplay} from "./privilege-display.js"
import {RoleDisplay} from "./role-display.js"

export interface PermissionsDisplay {
	roles: RoleDisplay[]
	privileges: PrivilegeDisplay[]
	rolesHavePrivileges: {
		id_role: string
		id_privilege: string
		active: boolean
		immutable: boolean
	}[]
}
