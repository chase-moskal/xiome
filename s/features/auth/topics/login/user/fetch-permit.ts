
import {find, or} from "../../../../../toolbox/dbby/dbby-helpers.js"
import {AuthTables, HardPermissions, Permit} from "../../../auth-types.js"

import {combineTableWithHardcodedBacking} from "./fetch-permit/combine-table-with-hardcoded-backing.js"

export async function fetchPermit({userId, tables, hardPermissions}: {
			userId: string
			tables: AuthTables
			hardPermissions: HardPermissions
		}): Promise<Permit> {

	const tablesBackedByHardcodedValues = {
		userRole: await combineTableWithHardcodedBacking({
			actualTable: tables.userRole,
			hardRows: hardPermissions.userRoles,
		}),
		rolePrivilege: await combineTableWithHardcodedBacking({
			actualTable: tables.rolePrivilege,
			hardRows: hardPermissions.rolePrivileges,
		}),
	}

	const userRoleRows = await tablesBackedByHardcodedValues.userRole.read(find({userId}))

	const roleIds = userRoleRows.map(({roleId}) => roleId)
	const rolePrivilegeRows = await tablesBackedByHardcodedValues.rolePrivilege.read({
		conditions: or(...roleIds.map(roleId => ({equal: {roleId}})))
	})

	return {
		privileges: rolePrivilegeRows.map(({privilegeId}) => privilegeId),
	}
}
