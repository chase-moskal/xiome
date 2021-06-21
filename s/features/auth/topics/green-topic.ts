
import {ApiError} from "renraku/x/api/api-error.js"
import {asTopic} from "renraku/x/identities/as-topic.js"

import {Scope} from "../types/tokens/scope.js"
import {fetchUser} from "./login/user/fetch-user.js"
import {find} from "../../../toolbox/dbby/dbby-mongo.js"
import {GreenAuth} from "../policies/types/green-auth.js"
import {AuthApiOptions} from "../types/auth-api-options.js"
import {AccessToken} from "../types/tokens/access-token.js"
import {RefreshToken} from "../types/tokens/refresh-token.js"
import {AccessPayload} from "../types/tokens/access-payload.js"
import {RefreshPayload} from "../types/tokens/refresh-payload.js"
import {originsFromDatabase} from "./origins/origins-from-database.js"
import {makePermissionsEngine} from "../../../assembly/backend/permissions2/permissions-engine.js"

export const greenTopic = ({
		config,
		signToken,
		verifyToken,
	}: AuthApiOptions) => asTopic<GreenAuth>()({

	async authorize({bakeTables}, {appId, scope, refreshToken}: {
				scope: Scope
				appId: string
				refreshToken?: RefreshToken
			}): Promise<AccessToken> {

		const tables = await bakeTables(appId)
		const permissionsEngine = makePermissionsEngine({
			isPlatform: appId === config.platform.appDetails.appId,
			permissionsTables: tables.permissions,
		})
		const appRow = await tables.app.app.one(find({appId}))

		if (!appRow)
			throw new ApiError(400, "incorrect app id")

		if (appRow.archived)
			throw new ApiError(403, "app has been archived")

		if (refreshToken) {
			const {userId} = await verifyToken<RefreshPayload>(refreshToken)
			const user = await fetchUser({
				userId,
				permissionsEngine,
				authTables: tables,
			})
			await tables.user.latestLogin.update({
				...find({userId}),
				upsert: {userId, time: Date.now()},
			})
			const privileges = await permissionsEngine.getUserPrivileges(userId)
			return signToken<AccessPayload>({
				lifespan: config.crypto.tokenLifespans.access,
				payload: {
					user,
					scope,
					permit: {privileges},
					appId: appId,
					origins: originsFromDatabase(appRow.origins),
				},
			})
		}
		else {
			const privileges = await permissionsEngine.getAnonymousPrivileges()
			return signToken<AccessPayload>({
				lifespan: config.crypto.tokenLifespans.access,
				payload: {
					user: undefined,
					appId,
					scope,
					origins: originsFromDatabase(appRow.origins),
					permit: {privileges},
				},
			})
		}
	},
})
