
import {appRoles} from "./app/app-roles.js"
import {appPrivileges} from "./app/app-privileges.js"
import {universalRoles} from "./universal/universal-roles.js"
import {universalPrivileges} from "./universal/universal-privileges.js"

export const appPermissions = {
	roles: {...universalRoles, ...appRoles},
	privileges: {...universalPrivileges, ...appPrivileges},
}
