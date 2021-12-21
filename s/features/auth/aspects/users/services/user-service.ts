
import * as renraku from "renraku"

import {fetchUser} from "../routines/user/fetch-user.js"
import {AuthOptions} from "../../../types/auth-options.js"
import {DamnId} from "../../../../../toolbox/damnedb/damn-id.js"
import {makePermissionsEngine} from "../../../../../assembly/backend/permissions/permissions-engine.js"

export const makeUserService = (options: AuthOptions) => renraku.service()

.policy(options.authPolicies.anonPolicy)

.expose(({authTables, access}) => ({

	async getUser({userId}: {userId: string}) {
		const permissionsEngine = makePermissionsEngine({
			permissionsTables: authTables.permissions,
			isPlatform: access.appId === options.config.platform.appDetails.appId,
		})
		return await fetchUser({
			authTables,
			permissionsEngine,
			userId: DamnId.fromString(userId),
		})
	},
}))
