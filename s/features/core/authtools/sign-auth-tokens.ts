
import {concurrent} from "../../../toolbox/concurrent.js"
import {SignToken, Scope, AccessPayload, RefreshPayload, CoreTables} from "../core-types.js"

import {assertUser} from "./usertools/assert-user.js"
import {fetchPermit} from "./usertools/fetch-permit.js"

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
			tables: CoreTables
			lifespans: {
				access: number
				refresh: number
			}
			signToken: SignToken
			generateNickname: () => string
		}) {

	const {user, permit} = await concurrent({
		user: assertUser({userId, tables, generateNickname}),
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
