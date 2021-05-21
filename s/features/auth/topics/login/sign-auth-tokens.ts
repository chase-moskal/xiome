
import {SignToken} from "redcrypto/dist/types.js"
import {concurrent} from "../../../../toolbox/concurrent.js"
import {RefreshPayload} from "../../types/tokens/refresh-payload.js"
import {AccessPayload} from "../../types/tokens/access-payload.js"
import {Scope} from "../../types/tokens/scope.js"

import {fetchUser} from "./user/fetch-user.js"
import {AuthTables} from "../../tables/types/auth-tables.js"
import {PermissionsEngine} from "../../../../assembly/backend/permissions2/types/permissions-engine.js"

export async function signAuthTokens({
			scope,
			appId,
			userId,
			tables,
			origins,
			lifespans,
			permissionsEngine,
			signToken,
			generateNickname,
		}: {
			scope: Scope
			appId: string
			userId: string
			origins: string[]
			tables: AuthTables
			permissionsEngine: PermissionsEngine
			lifespans: {
				access: number
				refresh: number
			}
			signToken: SignToken
			generateNickname: () => string
		}) {

	const {user, permit} = await concurrent({
		user: fetchUser({userId, authTables: tables, permissionsEngine}),
		permit: (async() => ({
			privileges: await permissionsEngine.getUserPrivileges(userId),
		}))(),
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
