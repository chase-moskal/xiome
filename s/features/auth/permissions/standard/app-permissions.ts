
import {powerPrivileges} from "./power-privileges.js"
import {adminRoleId} from "./build/ids/hard-role-ids.js"
import {universalPermissions} from "./universal-permissions.js"
import {buildHardPermissions} from "./build/build-hard-permissions.js"

export const appPermissions = buildHardPermissions({
	inherit: universalPermissions,
	privileges: {},
	roles: {
		"admin": {
			roleId: adminRoleId,
			privileges: powerPrivileges,
		},
	},
})
