
import {asApi} from "renraku/x/identities/as-api.js"

import {AuthApiOptions} from "../../types/auth-api-options.js"

export function permissionsApi(options: AuthApiOptions) {
	return asApi({
		// permissionsService: permissionsService(options),
	})
}
