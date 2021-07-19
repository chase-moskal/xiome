
import {asApi} from "renraku/x/identities/as-api.js"

import {AuthOptions} from "../../types/auth-options.js"

export function permissionsApi(options: AuthOptions) {
	return asApi({
		// permissionsService: permissionsService(options),
	})
}
