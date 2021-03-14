
import {platformPrivileges} from "./platform-privileges.js"
import {universalRoles} from "../universal/universal-roles.js"

export const platformRoles = {
	"technician": {
		...universalRoles.technician,
		privileges: {
			...universalRoles.technician.privileges,
			...platformPrivileges,
		},
	},
}
