
import {asApi} from "renraku/x/identities/as-api.js"

import {searchUsersParts} from "./services/search-users-parts.js"
import {roleAssignmentParts} from "./services/role-assignment-parts.js"
import {AdministrativeApiOptions} from "./types/administrative-api-options.js"
import {assembleApiContext} from "../../../framework/api/assemble-api-context.js"

export function makeAdministrativeApi(options: AdministrativeApiOptions) {
	return asApi({
		searchUsersService: assembleApiContext(searchUsersParts(options)),
		roleAssignmentService: assembleApiContext(roleAssignmentParts(options)),
	})
}
