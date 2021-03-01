
import {HardPermissions} from "../../../types/hard-permissions"
import {HardPermissionsBlueprint} from "../../../types/hard-permissions-blueprint.js"

import {buildRoles} from "./builders/build-roles.js"
import {buildPrivileges} from "./builders/build-privileges.js"
import {buildRoleHasPrivileges} from "./builders/build-role-has-privileges.js"

export function buildHardPermissions(blueprint: HardPermissionsBlueprint): HardPermissions {
	const privileges = buildPrivileges(blueprint)
	const roles = buildRoles(blueprint)
	const roleHasPrivileges = buildRoleHasPrivileges(blueprint, privileges)
	return {
		roles,
		privileges,
		roleHasPrivileges,

		// in the newly initialized system, no users exist to have any roles
		userHasRoles: [],
	}
}
