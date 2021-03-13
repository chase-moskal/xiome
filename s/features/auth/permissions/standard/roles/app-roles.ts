
import {universalRoles} from "./common/universal-roles.js"
import {powerPrivileges} from "../privileges/common/groups/power-privileges.js"

export const appRoles = {
	...universalRoles,
	"admin": {
		roleId: "ba4fa5096eb935e820732c42515c9b2f5d12881f641d26e0838c5e9680590e9f",
		privileges: powerPrivileges,
	},
}
