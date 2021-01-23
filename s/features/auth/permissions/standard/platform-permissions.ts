
import {powerPrivileges} from "./power-privileges.js"
import {universalPermissions} from "./universal-permissions.js"
import {buildHardPermissions} from "./build/build-hard-permissions.js"

export const platformPermissions = buildHardPermissions({
	inherit: universalPermissions,
	privileges: {
		"write_any_app": "c5ef00f7e5a5441749f635b4f1b4a99c3aaa36dd9227da60c50520594c6e1d46",
		"view_platform_stats": "6962326424efe4a6076ce750383f8f6972c77774672df036122e7e571edab680",
	},
	roles: {
		"technician": {
			roleId: "00dd53e8390b79d425840d08a88d997390fcb5ed7b805e98c9c5e9f284a6f759",
			privileges: [
				...powerPrivileges,
				"write_any_app",
				"view_platform_stats",
			],
		},
	},
})
