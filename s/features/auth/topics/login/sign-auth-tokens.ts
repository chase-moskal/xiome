
import {SignToken} from "redcrypto/dist/types.js"
import {concurrent} from "../../../../toolbox/concurrent.js"
import {RefreshPayload} from "../../types/tokens/refresh-payload.js"
import {AccessPayload} from "../../types/tokens/access-payload.js"
import {Scope} from "../../types/tokens/scope.js"

import {fetchUser} from "./user/fetch-user.js"
import {fetchPermit} from "./user/fetch-permit.js"
import {AuthTables} from "../../tables/types/auth-tables.js"

export async function signAuthTokens({
			scope,
			appId,
			userId,
			tables,
			origins,
			lifespans,
			signToken,
			generateNickname,
		}: {
			scope: Scope
			appId: string
			userId: string
			origins: string[]
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
			payload: {appId, origins, user, permit, scope},
			lifespan: lifespans.access,
		}),
		refreshToken: signToken<RefreshPayload>({
			payload: {userId: user.userId},
			lifespan: lifespans.refresh,
		}),
	})
}
