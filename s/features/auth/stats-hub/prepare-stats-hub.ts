
import {ApiError} from "renraku/x/api/api-error.js"

import {and, find} from "../../../toolbox/dbby/dbby-mongo.js"
import {day, month} from "../../../toolbox/goodtimes/times.js"
import {DbbyRow, DbbyTable} from "../../../toolbox/dbby/dbby-types.js"

import {StatsHub} from "./types/stats-hub.js"
import {AppTables} from "../tables/types/table-groups/app-tables.js"
import {UserTables} from "../tables/types/table-groups/user-tables.js"
import {namespaceKeyAppId} from "../tables/constants/namespace-key-app-id.js"
import {ExposeTableNamespaceAppId} from "../tables/types/utils/expose-table-namespace-app-id.js"

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
