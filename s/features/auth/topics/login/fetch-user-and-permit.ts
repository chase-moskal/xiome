
import {AuthTables} from "../../auth-types.js"
import {concurrent} from "../../../../toolbox/concurrent.js"

import {fetchUser} from "./user/fetch-user.js"
import {fetchPermit} from "./user/fetch-permit.js"

export async function fetchUserAndPermit({userId, tables, generateNickname}: {
			userId: string
			tables: AuthTables
			generateNickname: () => string
		}) {
	return concurrent({
		user: await fetchUser({userId, tables, generateNickname}),
		permit: await fetchPermit({userId, tables}),
	})
}
