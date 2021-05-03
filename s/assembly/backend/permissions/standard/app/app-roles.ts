
import {universalRoles} from "../universal/universal-roles.js"
import {staffPrivileges} from "./privilege-groups/staff-privileges.js"
import {userPrivileges} from "../universal/privilege-groups/user-privileges.js"
import {anybodyPrivileges} from "../universal/privilege-groups/anybody-privileges.js"

export const appRoles = {
	"admin": {
		roleId: "222yPwBDmRh5CfNyzmrcbZyBcx5ZtNHxchsfKCHyWsH5DMR2",
		privileges: {
			...anybodyPrivileges,
			...userPrivileges,
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
