
import {buildRoles} from "./builders/build-roles.js"
import {buildPrivileges} from "./builders/build-privileges.js"
import {buildRoleHasPrivileges} from "./builders/build-role-has-privileges.js"

import {HardPermissions} from "../types/hard-permissions.js"
import {HardPermissionsBlueprint} from "../types/hard-permissions-blueprint.js"

export function buildHardPermissions(
			blueprint: HardPermissionsBlueprint
		): HardPermissions {

	return {
		roles: buildRoles(blueprint.roles),
		privileges: buildPrivileges(blueprint.privileges),
		roleHasPrivileges: buildRoleHasPrivileges(blueprint.roles),

		// in the newly initialized system, no users exist to have any roles
		userHasRoles: [],
	}
}
