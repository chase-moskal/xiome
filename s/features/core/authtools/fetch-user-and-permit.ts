
import {CoreTables} from "../core-types.js"
import {concurrent} from "../../../toolbox/concurrent.js"

import {assertUser} from "./usertools/assert-user.js"
import {fetchPermit} from "./usertools/fetch-permit.js"

export async function fetchUserAndPermit({userId, tables, generateNickname}: {
			userId: string
			tables: CoreTables
			generateNickname: () => string
		}) {
	return concurrent({
		user: await assertUser({userId, tables, generateNickname}),
		permit: await fetchPermit({userId, tables}),
	})
}
