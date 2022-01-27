
import * as renraku from "renraku"
import {Id} from "dbmage"

import {fetchUser} from "../routines/user/fetch-user.js"
import {AuthOptions} from "../../../types/auth-options.js"
import {makePermissionsEngine} from "../../../../../assembly/backend/permissions/permissions-engine.js"

export const makeUserService = (options: AuthOptions) => renraku.service()

.policy(options.authPolicies.anonPolicy)

.expose(({database, access}) => ({

	async getUser({userId}: {userId: string}) {
		const permissionsEngine = makePermissionsEngine({
			permissionsTables: database.tables.auth.permissions,
			isPlatform: access.appId === options.config.platform.appDetails.appId,
		})
		return await fetchUser({
			authTables: database.tables.auth,
			permissionsEngine,
			userId: Id.fromString(userId),
		})
	},
}))
