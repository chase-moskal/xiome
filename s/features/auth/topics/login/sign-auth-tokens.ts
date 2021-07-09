
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
			id_app,
			id_user,
			tables,
			origins,
			lifespans,
			permissionsEngine,
			signToken,
			generateNickname,
		}: {
			scope: Scope
			id_app: string
			id_user: string
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
		user: fetchUser({id_user, authTables: tables, permissionsEngine}),
		permit: (async() => ({
			privileges: await permissionsEngine.getUserPrivileges(id_user),
		}))(),
	})

	return concurrent({
		accessToken: signToken<AccessPayload>({
			payload: {id_app, origins, user, permit, scope},
			lifespan: lifespans.access,
		}),
		refreshToken: signToken<RefreshPayload>({
			payload: {id_user: user.id_user},
			lifespan: lifespans.refresh,
		}),
	})
}
