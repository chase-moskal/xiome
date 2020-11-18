
import {AuthTables} from "../../auth-types.js"
import {concurrent} from "../../../../toolbox/concurrent.js"

import {assertUser} from "./user/assert-user.js"
import {fetchPermit} from "./user/fetch-permit.js"

export async function fetchUserAndPermit({userId, tables, generateNickname}: {
			userId: string
			tables: AuthTables
			generateNickname: () => string
		}) {
	return concurrent({
		user: await assertUser({userId, tables, generateNickname}),
		permit: await fetchPermit({userId, tables}),
	})
}
