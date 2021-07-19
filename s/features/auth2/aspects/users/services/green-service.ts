
import {ApiError} from "renraku/x/api/api-error.js"
import {apiContext} from "renraku/x/api/api-context.js"

import {AuthOptions} from "../../../types/auth-options.js"
import {find} from "../../../../../toolbox/dbby/dbby-helpers.js"
import {DamnId} from "../../../../../toolbox/damnedb/damn-id.js"
import {GreenAuth, GreenMeta} from "../../../types/auth-metas.js"
import {AccessPayload, RefreshPayload, Scope} from "../../../types/auth-tokens.js"
import {makePermissionsEngine} from "../../../../../assembly/backend/permissions2/permissions-engine.js"

export const greenService =
	(options: AuthOptions) => apiContext<GreenMeta, GreenAuth>()({

	policy: options.authPolicies.greenPolicy,
	expose: {

		async authorize({appTables, authTablesForApp}, {
				scope, refreshToken, appId: appIdString,
			}: {
				scope: Scope
				appId: string
				refreshToken?: string
			}) {

			const appId = DamnId.fromString(appIdString)
			const authTables = authTablesForApp(appId)
			const permissionsEngine = makePermissionsEngine({
				isPlatform: appId.toString() === options.config.platform.appDetails.appId,
				permissionsTables: authTables.permissions,
			})

			const appRow = await appTables.apps.one(find({appId}))

			if (!appRow)
				throw new ApiError(400, "incorrect app id")

			if (appRow.archived)
				throw new ApiError(403, "app has been archived")

			if (refreshToken) {
				const {userId: userIdString} = await options.verifyToken<RefreshPayload>(refreshToken)
				const userId = DamnId.fromString(userIdString)
				const user = await fetchUser({
					userId,
					permissionsEngine,
					authTables,
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
	},
})
