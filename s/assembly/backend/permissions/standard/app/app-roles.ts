
import {powerPrivileges} from "../universal/privilege-groups/power-privileges.js"
import {universalRoles} from "../universal/universal-roles.js"
import {staffPrivileges} from "./privilege-groups/staff-privileges.js"

export const appRoles = {
	"admin": {
		roleId: "ba4fa5096eb935e820732c42515c9b2f5d12881f641d26e0838c5e9680590e9f",
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