
import {asApi} from "renraku/x/identities/as-api.js"

import {searchUsersService} from "./services/search-users-service.js"
import {roleControlService} from "./services/role-control-service.js"
import {prepareServiceFunction} from "./utils/prepare-service-function.js"
import {AdministrativeApiOptions} from "./types/administrative-api-options.js"

export function makeAdministrativeApi(options: AdministrativeApiOptions) {
	const serviceOptions = {...options, service: prepareServiceFunction(options)}
	return asApi({
		searchUsersService: searchUsersService(serviceOptions),
		roleControlService: roleControlService(serviceOptions),
	})
}
