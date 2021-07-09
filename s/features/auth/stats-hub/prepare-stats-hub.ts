
import {ApiError} from "renraku/x/api/api-error.js"

import {day, month} from "../../../toolbox/goodtimes/times.js"
import {and, find} from "../../../toolbox/dbby/dbby-helpers.js"
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
	return async function getStatsHub(id_user: string): Promise<StatsHub> {

		async function throwForbiddenUser(id_app: string) {
			const row = await tables.app.appOwnership.one(find({id_app}))
			if (row.id_user !== id_user)
				throw new ApiError(403, "forbidden")
		}

		function exposeNamespacing<Row extends DbbyRow>(
				table: DbbyTable<Row>
			) {
			return <ExposeTableNamespaceAppId<Row>>table
		}

		return {
			countUsers: async id_app => {
				await throwForbiddenUser(id_app)
				return exposeNamespacing(tables.user.account)
					.count(find({[namespaceKeyAppId]: id_app}))
			},
			countUsersActiveDaily: async id_app => {
				await throwForbiddenUser(id_app)
				const timeToStartCounting = Date.now() - day
				return exposeNamespacing(tables.user.latestLogin)
					.count({
						conditions: and(
							{equal: {[namespaceKeyAppId]: id_app}},
							{greater: {time: timeToStartCounting}},
						)
					})
			},
			countUsersActiveMonthly: async id_app => {
				await throwForbiddenUser(id_app)
				const timeToStartCounting = Date.now() - month
				return exposeNamespacing(tables.user.latestLogin)
					.count({
						conditions: and(
							{equal: {[namespaceKeyAppId]: id_app}},
							{greater: {time: timeToStartCounting}},
						)
					})
			},
		}
	}
}
