
import * as renraku from "renraku"
import {Id, find} from "dbmage"

import {fetchUser} from "../routines/user/fetch-user.js"
import {AuthOptions} from "../../../types/auth-options.js"
import {originsFromDatabase} from "../../../utils/origins-from-database.js"
import {AccessPayload, RefreshPayload, Scope} from "../../../types/auth-tokens.js"
import {makePermissionsEngine} from "../../../../../assembly/backend/permissions/permissions-engine.js"
import {UnconstrainedTable} from "../../../../../framework/api/unconstrained-table.js"

export const makeGreenService = (options: AuthOptions) => renraku.service()

.policy(options.authPolicies.greenPolicy)

.expose(({databaseRaw}) => ({

	async authorize({
			scope, refreshToken, appId: appIdString,
		}: {
			scope: Scope
			appId: string
			refreshToken?: string
		}) {

		const appId = Id.fromString(appIdString)
		const databaseForApp = UnconstrainedTable.constrainDatabaseForApp({
			appId,
			database: databaseRaw,
		})
		const permissionsEngine = makePermissionsEngine({
			permissionsTables: databaseForApp.tables.auth.permissions,
			isPlatform: appId.toString() === options.config.platform.appDetails.appId,
		})

		const appRow = await databaseRaw.tables.apps.registrations.readOne(find({appId}))

		if (!appRow)
			throw new renraku.ApiError(400, "incorrect app id")

		if (appRow.archived)
			throw new renraku.ApiError(403, "app has been archived")

		if (refreshToken) {
			const {userId: userIdString} = await options.verifyToken<RefreshPayload>(refreshToken)
			const userId = Id.fromString(userIdString)
			const user = await fetchUser({
				userId,
				permissionsEngine,
				authTables: databaseForApp.tables.auth,
			})
			await databaseForApp.tables.auth.users.latestLogins.update({
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
