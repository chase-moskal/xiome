
import * as renraku from "renraku"

import {AdministrativeOptions} from "./types/administrative-options.js"
import {makeRoleAssignmentService} from "./services/role-assignment-service.js"

export function makeAdministrativeApi(options: AdministrativeOptions) {
	return renraku.api({
		roleAssignmentService: makeRoleAssignmentService(options),
	})
}
