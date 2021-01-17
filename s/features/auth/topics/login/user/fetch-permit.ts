
import {AuthTables, Permit} from "../../../auth-types.js"
import {find, or} from "../../../../../toolbox/dbby/dbby-helpers.js"

export async function fetchPermit({userId, tables}: {
			userId: string
			tables: AuthTables
		}): Promise<Permit> {

	const userRoleRows = await tables.userRole.read(find({userId}))
	const roleIds = userRoleRows.map(({roleId}) => roleId)
	const rolePrivilegeRows = await tables.rolePrivilege.read({
		conditions: or(...roleIds.map(roleId => ({equal: {roleId}})))
	})

	return {
		privileges: rolePrivilegeRows.map(({privilegeId}) => privilegeId),
	}
}
