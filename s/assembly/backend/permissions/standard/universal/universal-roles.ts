
import {getPrivileges} from "../../helpers/get-privileges.js"
import {universalPrivileges} from "./universal-privileges.js"
import {userPrivileges} from "./privilege-groups/user-privileges.js"
import {powerPrivileges} from "./privilege-groups/power-privileges.js"
import {anybodyPrivileges} from "./privilege-groups/anybody-privileges.js"

export const universalRoles = {
	"anybody": {
		roleId: "8xHhgfZpdKqtqFzSWp8HnYk5m2Mb7pGxBXfNZpsJqtfXP6BG",
		privileges: anybodyPrivileges,
	},
	"user": {
		roleId: "6YXFdhyM6nCgnCYFCWwkSxhyHw2zT2CtRKdtNRrfJctxNTyy",
		privileges: userPrivileges,
	},
	"technician": {
		roleId: "7n5zkdgnPnpbP97GhpkzWWKfFW7sxRB8CgBfDCzmJdBxCN8d",
		privileges: {
			...anybodyPrivileges,
			...userPrivileges,
			...powerPrivileges,
		},
	},
	"banned": {
		roleId: "9NdnHGNFPNxHbm8RwZNhbZ8w6KNCxNDC8GhBCgBP8gG6sqqS",
		privileges: getPrivileges(universalPrivileges, "banned"),
	},
}
