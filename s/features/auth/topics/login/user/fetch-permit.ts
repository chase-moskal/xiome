
import {find, or} from "../../../../../toolbox/dbby/dbby-helpers.js"
import {AuthTables, HardPermissions, Permit, PlatformConfig, UserRoleRow} from "../../../auth-types.js"

import {isTechnician} from "./fetch-permit/is-technician.js"
import {combineTableWithHardcodedBacking} from "./fetch-permit/combine-table-with-hardcoded-backing.js"

export async function fetchPermit({userId, tables, hardPermissions, technician}: {
			userId: string
			tables: AuthTables
			hardPermissions: HardPermissions
			technician: PlatformConfig["platform"]["technician"]
		}): Promise<Permit> {

	const technicianRoleId = hardPermissions.roles
		.find(row => row.label === "technician")
		.roleId

	const technicianRoleRows: UserRoleRow[] = await isTechnician({userId, tables, technician})
		? [{userId, roleId: technicianRoleId}]
		: []

	const tablesBackedByHardcodedValues = {
		userRole: await combineTableWithHardcodedBacking({
			actualTable: tables.userRole,
			hardRows: [...hardPermissions.userRoles, ...technicianRoleRows],
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
