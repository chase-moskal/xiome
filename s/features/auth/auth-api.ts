
import * as renraku from "renraku"

import {AuthOptions} from "./types/auth-options.js"
import {makeAppService} from "./aspects/apps/services/app-service.js"
import {makeUserService} from "./aspects/users/services/user-service.js"
import {makeGreenService} from "./aspects/users/services/green-service.js"
import {makeLoginService} from "./aspects/users/services/login-service.js"
import {makeAppEditService} from "./aspects/apps/services/app-edit-service.js"
import {makePersonalService} from "./aspects/users/services/personal-service.js"
import {makePermissionsService} from "./aspects/permissions/services/permissions-service.js"

export function authApi(options: AuthOptions) {
	return renraku.api({
		apps: {
			appService: makeAppService(options),
			appEditService: makeAppEditService(options),
		},
		users: {
			greenService: makeGreenService(options),
			loginService: makeLoginService(options),
			userService: makeUserService(options),
			personalService: makePersonalService(options),
		},
		permissions: {
			permissionsService: makePermissionsService(options),
		},
	})
}
