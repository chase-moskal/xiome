
import {powerPrivileges} from "./power-privileges.js"
import {universalPermissions} from "./universal-permissions.js"
import {buildHardPermissions} from "./infrastructure/build-hard-permissions.js"

export const appPermissions = buildHardPermissions({
	inherit: universalPermissions,
	privileges: {},
	roles: {
		"admin": {
			roleId: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
			privileges: powerPrivileges,
		},
	},
})
