
import {asApi} from "renraku/x/identities/as-api.js"

import {AdministrativeApiOptions} from "./types/administrative-api-options.js"
import {makeRoleAssignmentService} from "./services/role-assignment-service.js"

export function makeAdministrativeApi(options: AdministrativeApiOptions) {
	return asApi({
		roleAssignmentService: makeRoleAssignmentService(options),
	})
}
