
import {powerPrivileges} from "../universal/privilege-groups/power-privileges.js"
import {universalRoles} from "../universal/universal-roles.js"
import {staffPrivileges} from "./privilege-groups/staff-privileges.js"

export const appRoles = {
	"admin": {
		roleId: "222yPwBDmRh5CfNyzmrcbZyBcx5ZtNHxchsfKCHyWsH5DMR2",
		privileges: {
			...powerPrivileges,
			...staffPrivileges,
		},
	},
	"technician": {
		...universalRoles.technician,
		privileges: {
			...universalRoles.technician.privileges,
			...staffPrivileges,
		},
	},
}
