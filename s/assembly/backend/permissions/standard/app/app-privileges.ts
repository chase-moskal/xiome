
import {universalPrivileges} from "../universal/universal-privileges.js"
import {staffPrivileges} from "./privilege-groups/staff-privileges.js"

export const appPrivileges = {
	...universalPrivileges,
	...staffPrivileges,
}
