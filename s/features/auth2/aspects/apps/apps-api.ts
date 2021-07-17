
import {asApi} from "renraku/x/identities/as-api.js"

import {appService} from "./services/app-service.js"
import {adminService} from "./services/admins-service.js"
import {CommonAuthOptions} from "../../types/auth-options.js"

export function appsApi(options: CommonAuthOptions) {
	return asApi({
		appService: appService(options),
		adminService: adminService(options),
	})
}
