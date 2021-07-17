
import {asApi} from "renraku/x/identities/as-api.js"

import {appsApi} from "./aspects/apps/apps-api.js"
import {usersApi} from "./aspects/users/users-api.js"
import {AuthApiOptions, CommonAuthOptions} from "./types/auth-options.js"
import {permissionsApi} from "./aspects/permissions/permissions-api.js"

export function authApi({appTables, authTables, ...options}: AuthApiOptions) {
	return asApi({
		apps: appsApi(options),
		users: usersApi(options),
		permissions: permissionsApi(options),
	})
}
