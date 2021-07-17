
import {asApi} from "renraku/x/identities/as-api.js"

import {CommonAuthOptions} from "../../types/auth-options.js"

export function permissionsApi(options: CommonAuthOptions) {
	return asApi({
		// permissionsService: permissionsService(options),
	})
}
