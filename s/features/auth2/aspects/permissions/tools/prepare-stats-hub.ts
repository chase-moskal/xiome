
import {ApiError} from "renraku/x/api/api-error.js"

import {StatsHub} from "../types/stats-hub.js"
import {AppTables} from "../../apps/types/app-tables.js"
import {UserTables} from "../../users/types/user-tables.js"
import {DamnId} from "../../../../../toolbox/damnedb/damn-id.js"
import {day, month} from "../../../../../toolbox/goodtimes/times.js"
import {and, find} from "../../../../../toolbox/dbby/dbby-helpers.js"
import {namespaceKeyAppId} from "../../../../../framework/api/namespace-key-app-id.js"
import {NakedNamespacedTables} from "../../../../../framework/api/types/table-namespacing-for-apps.js"

export function prepareStatsHub({appTables, userTables}: {
		appTables: AppTables
		userTables: NakedNamespacedTables<UserTables>
	}) {
	return async function getStatsHub(userIdString: string): Promise<StatsHub> {
		const userId = DamnId.fromString(userIdString)

		async function throwForbiddenUser(appId: DamnId) {
			const row = await appTables.owners.one(find({appId}))
			if (row.userId !== userId)
				throw new ApiError(403, "forbidden")
		}

		return {
			countUsers: async appId => {
				await throwForbiddenUser(appId)
				return await userTables.accounts.count(find({[namespaceKeyAppId]: appId}))
			},
			countUsersActiveDaily: async appId => {
				await throwForbiddenUser(appId)
				const timeToStartCounting = Date.now() - day
				return userTables.latestLogins.count({
					conditions: and(
						{equal: {[namespaceKeyAppId]: appId}},
						{greater: {time: timeToStartCounting}},
					)
				})
			},
			countUsersActiveMonthly: async appId => {
				await throwForbiddenUser(appId)
				const timeToStartCounting = Date.now() - month
				return userTables.latestLogins.count({
					conditions: and(
						{equal: {[namespaceKeyAppId]: appId}},
						{greater: {time: timeToStartCounting}},
					)
				})
			},
		}
	}
}
