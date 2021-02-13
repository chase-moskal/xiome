
import {ApiError} from "renraku/x/api/api-error.js"

import {find} from "../../toolbox/dbby/dbby-mongo.js"
import {DbbyTable} from "../../toolbox/dbby/dbby-types.js"
import {AuthTables, StatsHub, AccountRow} from "./auth-types.js"

export function bakeStatsHub({authTables}: {authTables: AuthTables}) {
	return function getStatsHub(userId: string): StatsHub {

		async function throwForbiddenUser(appId: string) {
			const row = await authTables.appOwnership.one(find({appId}))
			if (row.userId !== userId)
				throw new ApiError(403, "forbidden")
		}

		return {
			countUsers: async appId => {
				await throwForbiddenUser(appId)
				return (<DbbyTable<AccountRow & { _appId: string} >>authTables.account)
					.count(find({ _appId: appId }))
			},
			countUsersActiveDaily: async appId => {
				await throwForbiddenUser(appId)
				return 1234
			},
			countUsersActiveMonthly: async appId => {
				await throwForbiddenUser(appId)
				return 1234
			},
		}
	}
}
