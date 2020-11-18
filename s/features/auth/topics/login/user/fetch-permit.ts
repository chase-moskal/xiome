
import {AuthTables, Permit} from "../../../auth-types.js"
import {and, or} from "../../../../../toolbox/dbby/dbby-helpers.js"

export async function fetchPermit({userId, tables}: {
			userId: string
			tables: AuthTables
		}): Promise<Permit> {

	const roleRows = await tables.userRole.read({
		conditions: and({equal: {userId}})
	})

	const privilegeRows = (
		await Promise.all(
			roleRows.map(({roleId}) => tables.rolePrivilege.read({
				conditions: or({equal: {roleId}})
			}))
		)
	).flat()

	return {
		roles: roleRows.map(role => role.roleId),
		privileges: privilegeRows.map(privilege => privilege.privilegeId),
	}
}
