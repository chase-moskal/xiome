
import {apiContext} from "renraku/x/api/api-context.js"

import {fetchUser} from "../routines/user/fetch-user.js"
import {AuthOptions} from "../../../types/auth-options.js"
import {AnonAuth, AnonMeta} from "../../../types/auth-metas.js"
import {DamnId} from "../../../../../toolbox/damnedb/damn-id.js"
import {makePermissionsEngine} from "../../../../../assembly/backend/permissions/permissions-engine.js"

export const makeUserService = (
		options: AuthOptions
	) => apiContext<AnonMeta, AnonAuth>()({
	policy: options.authPolicies.anonPolicy,
	expose: {

		async getUser({authTables, access}, {userId}: {userId: string}) {
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
	},
})
