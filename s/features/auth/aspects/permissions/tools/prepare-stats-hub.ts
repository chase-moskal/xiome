
import * as renraku from "renraku"

import {StatsHub} from "../types/stats-hub.js"
import {AppTables} from "../../apps/types/app-tables.js"
import {AuthTables} from "../../../types/auth-tables.js"
import {DamnId} from "../../../../../toolbox/damnedb/damn-id.js"
import {day, month} from "../../../../../toolbox/goodtimes/times.js"
import {and, find} from "../../../../../toolbox/dbby/dbby-helpers.js"
import {UnconstrainedTables} from "../../../../../framework/api/types/table-namespacing-for-apps.js"

export function prepareStatsHub({appTables, authTables}: {
		appTables: AppTables
		authTables: UnconstrainedTables<AuthTables>
	}) {
	return async function getStatsHub(userId: DamnId): Promise<StatsHub> {

		async function throwForbiddenUser(appId: DamnId) {
			const row = await appTables.owners.one(find({appId}))
			if (row.userId.toString() !== userId.toString())
				throw new renraku.ApiError(403, "forbidden")
		}

		return {
			countUsers: async appId => {
				await throwForbiddenUser(appId)
				return await authTables.namespaceForApp(appId).users.accounts.count({conditions: false})
			},
			countUsersActiveDaily: async appId => {
				await throwForbiddenUser(appId)
				const timeToStartCounting = Date.now() - day
				return authTables.namespaceForApp(appId).users.latestLogins.count({
					conditions: and({greater: {time: timeToStartCounting}}),
				})
			},
			countUsersActiveMonthly: async appId => {
				await throwForbiddenUser(appId)
				const timeToStartCounting = Date.now() - month
				return authTables.namespaceForApp(appId).users.latestLogins.count({
					conditions: and({greater: {time: timeToStartCounting}}),
				})
			},
		}
	}
}
