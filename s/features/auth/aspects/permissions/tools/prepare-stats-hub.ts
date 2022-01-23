
import * as renraku from "renraku"
import * as dbproxy from "../../../../../toolbox/dbproxy/dbproxy.js"

import {StatsHub} from "../types/stats-hub.js"
import {day, month} from "../../../../../toolbox/goodtimes/times.js"
import {DatabaseSubsection2} from "../../../../../assembly/backend/types/database.js"

export function prepareStatsHub({database}: {
		database: DatabaseSubsection2<"apps" | "auth">
	}) {
	return async function getStatsHub(userId: dbproxy.Id): Promise<StatsHub> {

		async function throwForbiddenUser(appId: dbproxy.Id) {
			const row = await database.tables.apps.owners.readOne(dbproxy.find({appId}))
			if (row.userId.toString() !== userId.toString())
				throw new renraku.ApiError(403, "forbidden")
		}

		return {
			countUsers: async appId => {
				await throwForbiddenUser(appId)
				const accountsTable = database.tables.auth.users.accounts
					.constrainForApp(appId)
				return accountsTable.count({conditions: false})
			},
			countUsersActiveDaily: async appId => {
				await throwForbiddenUser(appId)
				const timeToStartCounting = Date.now() - day
				const latestLoginsTable = database.tables.auth.users.latestLogins
					.constrainForApp(appId)
				return latestLoginsTable.count({
					conditions: dbproxy.and({greater: {time: timeToStartCounting}}),
				})
			},
			countUsersActiveMonthly: async appId => {
				await throwForbiddenUser(appId)
				const timeToStartCounting = Date.now() - month
				const latestLoginsTable = database.tables.auth.users.latestLogins
					.constrainForApp(appId)
				return latestLoginsTable.count({
					conditions: dbproxy.and({greater: {time: timeToStartCounting}}),
				})
			},
		}
	}
}
