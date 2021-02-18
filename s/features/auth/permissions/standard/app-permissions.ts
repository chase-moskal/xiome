
import {powerPrivileges} from "./power-privileges.js"
import {universalPermissions} from "./universal-permissions.js"
import {buildHardPermissions} from "./build/build-hard-permissions.js"
import {adminRoleId, technicianRoleId} from "./build/ids/hard-role-ids.js"

export const appPermissions = buildHardPermissions({
	inherit: universalPermissions,
	privileges: {},
	roles: {
		"admin": {
			roleId: adminRoleId,
			privileges: powerPrivileges,
		},
		"technician": {
			roleId: technicianRoleId,
			privileges: powerPrivileges,
		},
	},
})
