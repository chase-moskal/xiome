
import * as renraku from "renraku"
import * as dbmage from "dbmage"

import {StatsHub} from "../types/stats-hub.js"
import {day, month} from "../../../../../toolbox/goodtimes/times.js"
import {DatabaseRaw} from "../../../../../assembly/backend/types/database.js"

export function prepareStatsHub({database}: {
		database: DatabaseRaw
	}) {
	return async function getStatsHub(userId: dbmage.Id): Promise<StatsHub> {

		async function throwForbiddenUser(appId: dbmage.Id) {
			const row = await database.tables.apps.owners.readOne(dbmage.find({appId}))
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
					conditions: dbmage.and({greater: {time: timeToStartCounting}}),
				})
			},
			countUsersActiveMonthly: async appId => {
				await throwForbiddenUser(appId)
				const timeToStartCounting = Date.now() - month
				const latestLoginsTable = database.tables.auth.users.latestLogins
					.constrainForApp(appId)
				return latestLoginsTable.count({
					conditions: dbmage.and({greater: {time: timeToStartCounting}}),
				})
			},
		}
	}
}
