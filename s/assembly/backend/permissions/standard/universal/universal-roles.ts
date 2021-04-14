
import {getPrivileges} from "../../helpers/get-privileges.js"
import {powerPrivileges} from "./privilege-groups/power-privileges.js"
import {universalPrivileges} from "./universal-privileges.js"

export const universalRoles = {
	"technician": {
		roleId: "7n5zkdgnPnpbP97GhpkzWWKfFW7sxRB8CgBfDCzmJdBxCN8d",
		privileges: powerPrivileges,
	},
	"banned": {
		roleId: "9NdnHGNFPNxHbm8RwZNhbZ8w6KNCxNDC8GhBCgBP8gG6sqqS",
		privileges: getPrivileges(universalPrivileges, "banned"),
	},
}
