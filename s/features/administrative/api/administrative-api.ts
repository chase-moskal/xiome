
import {asApi} from "renraku/x/identities/as-api.js"

import {apiContext} from "renraku/x/api/api-context.js"
import {UserAuth} from "../../auth/policies/types/user-auth.js"
import {UserMeta} from "../../auth/policies/types/user-meta.js"
import {searchUsersService} from "./services/search-users-service.js"
import {roleAssignmentService} from "./services/role-assignment-service.js"
import {AdministrativeApiOptions} from "./types/administrative-api-options.js"
import {AdminisrativeServiceParts} from "./types/administrative-service-parts.js"

export function makeAdministrativeApi(options: AdministrativeApiOptions) {
	
	function assemble(parts: AdminisrativeServiceParts<UserAuth>) {
		return apiContext<UserMeta, UserAuth>()({
			policy: {
				processAuth: async(meta, request) => {
					const auth = await options.authPolicies.user.processAuth(meta, request)
					return parts.policy(auth)
				},
			},
			expose: parts.expose,
		})
	}

	return asApi({
		searchUsersService: assemble(searchUsersService(options)),
		roleAssignmentService: assemble(roleAssignmentService(options)),
	})
}
