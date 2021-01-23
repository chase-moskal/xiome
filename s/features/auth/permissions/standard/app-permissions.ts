
import {powerPrivileges} from "./power-privileges.js"
import {universalPermissions} from "./universal-permissions.js"
import {buildHardPermissions} from "./build/build-hard-permissions.js"

export const appPermissions = buildHardPermissions({
	inherit: universalPermissions,
	privileges: {},
	roles: {
		"admin": {
			roleId: "ba4fa5096eb935e820732c42515c9b2f5d12881f641d26e0838c5e9680590e9f",
			privileges: powerPrivileges,
		},
	},
})
