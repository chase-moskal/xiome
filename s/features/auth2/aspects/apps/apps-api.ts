
import {asApi} from "renraku/x/identities/as-api.js"

import {appService} from "./services/app-service.js"
import {adminService} from "./services/admins-service.js"
import {AuthApiOptions} from "../../types/auth-api-options.js"

export function appsApi(options: AuthApiOptions) {
	return asApi({
		appService: appService(options),
		adminService: adminService(options),
	})
}
