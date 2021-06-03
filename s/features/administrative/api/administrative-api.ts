
import {asApi} from "renraku/x/identities/as-api.js"

import {searchUsersService} from "./services/search-users-service.js"
import {roleAssignmentService} from "./services/role-assignment-service.js"
import {AdministrativeApiOptions} from "./types/administrative-api-options.js"

export function makeAdministrativeApi(options: AdministrativeApiOptions) {
	return asApi({
		searchUsersService: searchUsersService(options),
		roleAssignmentService: roleAssignmentService(options),
	})
}
