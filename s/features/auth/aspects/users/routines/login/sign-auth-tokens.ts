
import {fetchUser} from "../user/fetch-user.js"
import {SignToken} from "redcrypto/dist/types.js"
import {AuthTables} from "../../../../types/auth-tables.js"
import {concurrent} from "../../../../../../toolbox/concurrent.js"
import {DamnId} from "../../../../../../toolbox/damnedb/damn-id.js"
import {AccessPayload, RefreshPayload, Scope} from "../../../../types/auth-tokens.js"
import {PermissionsEngine} from "../../../../../../assembly/backend/permissions2/types/permissions-engine.js"

export async function signAuthTokens({
			scope,
			appId,
			userId,
			origins,
			lifespans,
			authTables,
			permissionsEngine,
			signToken,
		}: {
			scope: Scope
			appId: string
			userId: DamnId
			origins: string[]
			authTables: AuthTables
			permissionsEngine: PermissionsEngine
			lifespans: {
				access: number
				refresh: number
			}
			signToken: SignToken
		}) {

	const {user, permit} = await concurrent({
		user: fetchUser({userId, authTables, permissionsEngine}),
		permit: (async() => ({
			privileges: await permissionsEngine.getUserPrivileges(userId.toString()),
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
