
import {asApi} from "renraku/x/identities/as-api.js"

import {makeRoleAssignmentService} from "./services/role-assignment-service.js"
import {AdministrativeOptions} from "./types/administrative-options.js"

export function makeAdministrativeApi(options: AdministrativeOptions) {
	return asApi({
		roleAssignmentService: makeRoleAssignmentService(options),
	})
}
