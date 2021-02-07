
import {AuthTables, Permit} from "../../../auth-types.js"
import {find, or} from "../../../../../toolbox/dbby/dbby-helpers.js"

import {isCurrentlyWithinTimeframe} from "./utils/is-currently-within-timeframe.js"

export async function fetchPermit({userId, tables}: {
			userId: string
			tables: AuthTables
		}): Promise<Permit> {

	const userHasRoleRows = await tables.userHasRole.read(find({userId}))
	const roleIds = userHasRoleRows
		.filter(isCurrentlyWithinTimeframe)
		.map(({roleId}) => roleId)

	const roleHasPrivilegeRows = await tables.roleHasPrivilege.read({
		conditions: or(...roleIds.map(roleId => ({equal: {roleId}})))
	})

	return {
		privileges: roleHasPrivilegeRows.map(({privilegeId}) => privilegeId),
	}
}
