
import {ApiError} from "renraku/x/api/api-error.js"
import {asTopic} from "renraku/x/identities/as-topic.js"

import {Scope} from "../types/tokens/scope.js"
import {fetchUser} from "./login/user/fetch-user.js"
import {GreenAuth} from "../policies/types/green-auth.js"
import {find} from "../../../toolbox/dbby/dbby-helpers.js"
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

	async authorize({bakeTables}, {id_app, scope, refreshToken}: {
				scope: Scope
				id_app: string
				refreshToken?: RefreshToken
			}): Promise<AccessToken> {

		const tables = await bakeTables(id_app)
		const permissionsEngine = makePermissionsEngine({
			isPlatform: id_app === config.platform.appDetails.id_app,
			permissionsTables: tables.permissions,
		})
		const appRow = await tables.app.app.one(find({id_app}))

		if (!appRow)
			throw new ApiError(400, "incorrect app id")

		if (appRow.archived)
			throw new ApiError(403, "app has been archived")

		if (refreshToken) {
			const {id_user} = await verifyToken<RefreshPayload>(refreshToken)
			const user = await fetchUser({
				id_user,
				permissionsEngine,
				authTables: tables,
			})
			await tables.user.latestLogin.update({
				...find({id_user}),
				upsert: {id_user, time: Date.now()},
			})
			const privileges = await permissionsEngine.getUserPrivileges(id_user)
			return signToken<AccessPayload>({
				lifespan: config.crypto.tokenLifespans.access,
				payload: {
					user,
					scope,
					permit: {privileges},
					id_app: id_app,
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
					id_app,
					scope,
					origins: originsFromDatabase(appRow.origins),
					permit: {privileges},
				},
			})
		}
	},
})
