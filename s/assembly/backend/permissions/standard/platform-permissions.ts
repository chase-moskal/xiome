
import {platformRoles} from "./platform/platform-roles.js"
import {platformPrivileges} from "./platform/platform-privileges.js"
import {universalPrivileges} from "./universal/universal-privileges.js"
import {universalRoles} from "./universal/universal-roles.js"

export const platformPermissions = {
	roles: {...universalRoles, ...platformRoles},
	privileges: {...universalPrivileges, ...platformPrivileges},
}
