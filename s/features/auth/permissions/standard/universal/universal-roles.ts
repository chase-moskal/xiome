
import {getPrivileges} from "../../helpers/get-privileges.js"
import {powerPrivileges} from "./privilege-groups/power-privileges.js"
import {universalPrivileges} from "./universal-privileges.js"

export const universalRoles = {
	"technician": {
		roleId: "00dd53e8390b79d425840d08a88d997390fcb5ed7b805e98c9c5e9f284a6f759",
		privileges: powerPrivileges,
	},
	"banned": {
		roleId: "40b8cb44d0c53d4c17e28aaac661ac325014486adab9126ff67b1d51b8fe7cc1",
		privileges: getPrivileges(universalPrivileges, "banned"),
	},
}
