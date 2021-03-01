
import {PublicUserRole} from "../../../../types/public-user-row"
import {AuthTables} from "../../../../tables/types/auth-tables.js"
import {find, or} from "../../../../../../toolbox/dbby/dbby-mongo.js"
import {isCurrentlyWithinTimeframe} from "./is-currently-within-timeframe.js"

export async function fetchPublicUserRoles({userId, tables}: {
			userId: string
			tables: AuthTables
		}): Promise<PublicUserRole[]> {

	const isPublic = (row: {public: boolean}) => row.public

	const userHasRoleRows = await tables.permissions.userHasRole.read(find({userId}))
	const roleIds = userHasRoleRows
		.filter(isCurrentlyWithinTimeframe)
		.filter(isPublic)
		.map(row => row.roleId)

	const roleRows = await tables.permissions.role.read({
		conditions: or(...roleIds.map(roleId => ({equal: {roleId}})))
	})

	const combinedData = userHasRoleRows.map(userRoleRow => {
		const roleRow = roleRows.find(row => row.roleId === userRoleRow.roleId)
		return {...userRoleRow, ...roleRow}
	})

	const roles = combinedData.map(x => (<PublicUserRole>{
		roleId: x.roleId,
		label: x.label,
		timeframeEnd: x.timeframeEnd,
		timeframeStart: x.timeframeStart,
	}))

	return roles
}
