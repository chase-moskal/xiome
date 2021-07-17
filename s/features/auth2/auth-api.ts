
import {asApi} from "renraku/x/identities/as-api.js"

import {appsApi} from "./aspects/apps/apps-api.js"
import {usersApi} from "./aspects/users/users-api.js"
import {AuthApiOptions} from "./types/auth-api-options.js"
import {permissionsApi} from "./aspects/permissions/permissions-api.js"

export function authApi(options: AuthApiOptions) {
	return asApi({
		apps: appsApi(options),
		users: usersApi(options),
		permissions: permissionsApi(options),
	})
}
