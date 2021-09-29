
import {PrivilegeDisplay} from "./privilege-display.js"
import {RoleDisplay} from "./role-display.js"

export interface PermissionsDisplay {
	roles: RoleDisplay[]
	privileges: PrivilegeDisplay[]
	rolesHavePrivileges: {
		roleId: string
		privilegeId: string
		active: boolean
		immutable: boolean
		time: number
	}[]
}
