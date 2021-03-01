
import {ApiError} from "renraku/x/api/api-error.js"

import {namespaceKeyAppId} from "./tables/constants/namespace-key-app-id.js"
import {and, find} from "../../toolbox/dbby/dbby-mongo.js"
import {day, month} from "../../toolbox/goodtimes/times.js"
import {DbbyRow, DbbyTable} from "../../toolbox/dbby/dbby-types.js"
import {ExposeTableNamespaceAppId} from "./types/ExposeTableNamespaceAppId.js"
import {AppTables} from "./types/AppTables"
import {UserTables} from "./types/UserTables"
import {StatsHub} from "./types/StatsHub.js"

export function prepareStatsHub({tables}: {
			tables: {
				app: AppTables
				user: UserTables
			}
		}) {
	return async function getStatsHub(userId: string): Promise<StatsHub> {

		async function throwForbiddenUser(appId: string) {
			const row = await tables.app.appOwnership.one(find({appId}))
			if (row.userId !== userId)
				throw new ApiError(403, "forbidden")
		}

		function exposeNamespacing<Row extends DbbyRow>(
				table: DbbyTable<Row>
			) {
			return <ExposeTableNamespaceAppId<Row>>table
		}

		return {
			countUsers: async appId => {
				await throwForbiddenUser(appId)
				return exposeNamespacing(tables.user.account)
					.count(find({[namespaceKeyAppId]: appId}))
			},
			countUsersActiveDaily: async appId => {
				await throwForbiddenUser(appId)
				const timeToStartCounting = Date.now() - day
				return exposeNamespacing(tables.user.latestLogin)
					.count({
						conditions: and(
							{equal: {_appId: appId}},
							{greater: {time: timeToStartCounting}},
						)
					})
			},
			countUsersActiveMonthly: async appId => {
				await throwForbiddenUser(appId)
				const timeToStartCounting = Date.now() - month
				return exposeNamespacing(tables.user.latestLogin)
					.count({
						conditions: and(
							{equal: {_appId: appId}},
							{greater: {time: timeToStartCounting}},
						)
					})
			},
		}
	}
}
