
import {HardPermissionsBlueprint, HardPermissions} from "../../auth-types.js"

import {buildRoles} from "./builders/build-roles.js"
import {buildPrivileges} from "./builders/build-privileges.js"
import {buildRolePrivileges} from "./builders/build-role-privileges.js"

export function buildHardPermissions(blueprint: HardPermissionsBlueprint): HardPermissions {
	const privileges = buildPrivileges(blueprint)
	const roles = buildRoles(blueprint)
	const rolePrivileges = buildRolePrivileges(blueprint, privileges)
	return {
		roles,
		privileges,
		rolePrivileges,

		// TODO ok so that's why user roles are empty?
		userRoles: [],
	}
}
