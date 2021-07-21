
// import {Permit} from "../../../types/permit.js"
// import {AuthTables} from "../../../tables/types/auth-tables.js"
// import {find, or} from "../../../../../toolbox/dbby/dbby-helpers.js"
// import {isCurrentlyWithinTimeframe} from "./utils/is-currently-within-timeframe.js"
// import {userPrivileges} from "../../../../../assembly/backend/permissions/standard/universal/privilege-groups/user-privileges.js"
// import {anybodyPrivileges} from "../../../../../assembly/backend/permissions/standard/universal/privilege-groups/anybody-privileges.js"

// export async function fetchPermit({userId, tables}: {
// 			userId: string
// 			tables: AuthTables
// 		}): Promise<Permit> {

// 	const userHasRoleRows = await tables.permissions.userHasRole
// 		.read(find({userId}))

// 	const roleIds = userHasRoleRows
// 		.filter(isCurrentlyWithinTimeframe)
// 		.map(({roleId}) => roleId)

// 	const roleHasPrivilegeRows = await tables.permissions.roleHasPrivilege
// 		.read({
// 			conditions: or(...roleIds.map(roleId => ({equal: {roleId}})))
// 		})

// 	return {
// 		privileges: [
// 			// ...Object.values(anybodyPrivileges),
// 			// ...Object.values(userPrivileges),
// 			...roleHasPrivilegeRows.map(({privilegeId}) => privilegeId)
// 		],
// 	}
// }
