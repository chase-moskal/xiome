
import {asApi} from "renraku/x/identities/as-api.js"

import {appService} from "./services/app-service.js"
import {AuthOptions} from "../../types/auth-options.js"
import {appEditService} from "./services/app-edit-service.js"

export function appsApi(options: AuthOptions) {
	return asApi({
		appService: appService(options),
		adminService: appEditService(options),
	})
}
