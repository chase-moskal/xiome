
import {buildHardPermissions} from "./infrastructure/build-hard-permissions.js"

export const universalPermissions = buildHardPermissions({
	roles: {
		"banned": {
			roleId: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx",
			privileges: [
				"banned_from_public_visibility",
			],
		},
	},
	privileges: {
		"edit_any_profile": "GGGGGGGGGGGGGGGGGGGGGGGGGG",
		"edit_user_roles": "ZZZZZZZZZZZZZZZZZ",
		"edit_permissions": "YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY",
		"banned_from_public_visibility": "YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY",
	},
})
