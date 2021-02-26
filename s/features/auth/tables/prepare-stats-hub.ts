
import {ApiError} from "renraku/x/api/api-error.js"

import {namespaceKeyAppId} from "./namespace-key-app-id.js"
import {and, find} from "../../../toolbox/dbby/dbby-mongo.js"
import {day, month} from "../../../toolbox/goodtimes/times.js"
import {DbbyRow, DbbyTable} from "../../../toolbox/dbby/dbby-types.js"
import {AuthTables, StatsHub, ExposeTableNamespaceAppId, AppTables} from "../auth-types.js"

export function prepareStatsHub({appTables, authTables}: {
			appTables: AppTables
			authTables: AuthTables
		}) {
	return async function getStatsHub(userId: string): Promise<StatsHub> {

		async function throwForbiddenUser(appId: string) {
			const row = await appTables.appOwnership.one(find({appId}))
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
				return exposeNamespacing(authTables.account)
					.count(find({[namespaceKeyAppId]: appId}))
			},
			countUsersActiveDaily: async appId => {
				await throwForbiddenUser(appId)
				const timeToStartCounting = Date.now() - day
				return exposeNamespacing(authTables.latestLogin)
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
				return exposeNamespacing(authTables.latestLogin)
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
