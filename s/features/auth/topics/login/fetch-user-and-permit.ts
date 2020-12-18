
import {concurrent} from "../../../../toolbox/concurrent.js"
import {AuthTables, HardPermissions, PlatformConfig} from "../../auth-types.js"

import {fetchUser} from "./user/fetch-user.js"
import {fetchPermit} from "./user/fetch-permit.js"

export async function fetchUserAndPermit({
			userId,
			tables,
			technician,
			hardPermissions,
			generateNickname,
		}: {
			userId: string
			tables: AuthTables
			hardPermissions: HardPermissions
			technician: PlatformConfig["platform"]["technician"]
			generateNickname: () => string
		}) {
	return concurrent({
		user: await fetchUser({userId, tables, generateNickname}),
		permit: await fetchPermit({userId, tables, hardPermissions, technician}),
	})
}
