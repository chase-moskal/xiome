
import * as renraku from "renraku"

import {fetchUser} from "../routines/user/fetch-user.js"
import {AuthOptions} from "../../../types/auth-options.js"
import {find} from "../../../../../toolbox/dbby/dbby-helpers.js"
import {DamnId} from "../../../../../toolbox/damnedb/damn-id.js"
import {originsFromDatabase} from "../../../utils/origins-from-database.js"
import {AccessPayload, RefreshPayload, Scope} from "../../../types/auth-tokens.js"
import {makePermissionsEngine} from "../../../../../assembly/backend/permissions/permissions-engine.js"

export const makeGreenService = (options: AuthOptions) => renraku.service()

.policy(options.authPolicies.greenPolicy)

.expose(({appTables, authTables: unconstrainedAuthTables}) => ({

	async authorize({
			scope, refreshToken, appId: appIdString,
		}: {
			scope: Scope
			appId: string
			refreshToken?: string
		}) {

		const appId = DamnId.fromString(appIdString)
		const authTables = unconstrainedAuthTables.namespaceForApp(appId)
		const permissionsEngine = makePermissionsEngine({
			permissionsTables: authTables.permissions,
			isPlatform: appId.toString() === options.config.platform.appDetails.appId,
		})

		const appRow = await appTables.registrations.one(find({appId}))

		if (!appRow)
			throw new renraku.ApiError(400, "incorrect app id")

		if (appRow.archived)
			throw new renraku.ApiError(403, "app has been archived")

		if (refreshToken) {
			const {userId: userIdString} = await options.verifyToken<RefreshPayload>(refreshToken)
			const userId = DamnId.fromString(userIdString)
			const user = await fetchUser({
				userId,
				authTables,
				permissionsEngine,
			})
			await authTables.users.latestLogins.update({
				...find({userId}),
				upsert: {userId, time: Date.now()},
			})
			const privileges =
				await permissionsEngine
					.getUserPrivileges(userId.toString())
			return options.signToken<AccessPayload>({
				lifespan: options.config.crypto.tokenLifespans.access,
				payload: {
					user,
					scope,
					permit: {privileges},
					appId: appId.toString(),
					origins: originsFromDatabase(appRow.origins),
				},
			})
		}
		else {
			const privileges = await permissionsEngine.getAnonymousPrivileges()
			return options.signToken<AccessPayload>({
				lifespan: options.config.crypto.tokenLifespans.access,
				payload: {
					user: undefined,
					appId: appId.toString(),
					scope,
					origins: originsFromDatabase(appRow.origins),
					permit: {privileges},
				},
			})
		}
	}
}))
