
import {universalRoles} from "./common/universal-roles.js"
import {getPrivileges} from "../privileges/helpers/get-privileges.js"
import {platformPrivileges} from "../privileges/platform-privileges.js"

export const platformRoles = {
	"technician": {
		...universalRoles.technician,
		privileges: {
			...universalRoles.technician.privileges,
			...getPrivileges(platformPrivileges,
				"write any app",
				"view platform stats",
			),
		},
	},
}
