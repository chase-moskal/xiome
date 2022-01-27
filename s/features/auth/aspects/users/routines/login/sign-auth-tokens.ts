
import {SignToken} from "redcrypto/x/types.js"
import {Id} from "dbmage"
import * as dbmage from "dbmage"

import {fetchUser} from "../user/fetch-user.js"
import {AuthSchema} from "../../../../types/auth-schema.js"
import {concurrent} from "../../../../../../toolbox/concurrent.js"
import {AccessPayload, RefreshPayload, Scope} from "../../../../types/auth-tokens.js"
import {PermissionsEngine} from "../../../../../../assembly/backend/permissions/types/permissions-engine.js"

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
			userId: Id
			origins: string[]
			permissionsEngine: PermissionsEngine
			authTables: dbmage.SchemaToTables<AuthSchema>
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
