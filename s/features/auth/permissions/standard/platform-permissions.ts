
import {powerPrivileges} from "./power-privileges.js"
import {universalPermissions} from "./universal-permissions.js"
import {buildHardPermissions} from "./build/build-hard-permissions.js"
import { technicianRoleId } from "./build/ids/hard-role-ids.js"

export const platformPermissions = buildHardPermissions({
	inherit: universalPermissions,
	privileges: {
		"write_any_app": "c5ef00f7e5a5441749f635b4f1b4a99c3aaa36dd9227da60c50520594c6e1d46",
		"view_platform_stats": "6962326424efe4a6076ce750383f8f6972c77774672df036122e7e571edab680",
	},
	roles: {
		"technician": {
			roleId: technicianRoleId,
			privileges: [
				...powerPrivileges,
				"write_any_app",
				"view_platform_stats",
			],
		},
	},
})
