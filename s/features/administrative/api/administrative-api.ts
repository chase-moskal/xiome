
import {asApi} from "renraku/x/identities/as-api.js"

import {roleAssignmentParts} from "./services/role-assignment-parts.js"
import {AdministrativeApiOptions} from "./types/administrative-api-options.js"
import {assembleApiContext} from "../../../framework/api/assemble-api-context.js"

export function makeAdministrativeApi(options: AdministrativeApiOptions) {
	return asApi({
		roleAssignmentService: assembleApiContext(roleAssignmentParts(options)),
	})
}
