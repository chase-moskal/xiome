
import {concurrent} from "../../../../toolbox/concurrent.js"
import {SignToken, Scope, AccessPayload, RefreshPayload} from "../../types/auth-types.js"

import {fetchUser} from "./user/fetch-user.js"
import {fetchPermit} from "./user/fetch-permit.js"
import {AuthTables} from "../../tables/types/auth-tables.js"

export async function signAuthTokens({
			scope,
			userId,
			tables,
			lifespans,
			signToken,
			generateNickname,
		}: {
			scope: Scope
			userId: string
			tables: AuthTables
			lifespans: {
				access: number
				refresh: number
			}
			signToken: SignToken
			generateNickname: () => string
		}) {

	const {user, permit} = await concurrent({
		user: fetchUser({userId, tables, generateNickname}),
		permit: fetchPermit({userId, tables}),
	})

	return concurrent({
		accessToken: signToken<AccessPayload>({
			payload: {user, permit, scope},
			lifespan: lifespans.access,
		}),
		refreshToken: signToken<RefreshPayload>({
			payload: {userId: user.userId},
			lifespan: lifespans.refresh,
		}),
	})
}
