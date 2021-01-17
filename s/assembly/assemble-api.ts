
import {asApi} from "renraku/x/identities/as-api.js"

import {ApiOptions} from "./assembly-types.js"
import {makeAuthApi} from "../features/auth/auth-api.js"

export function assembleApi(options: ApiOptions) {

	return asApi({
		auth: makeAuthApi({
			authTables: options.tables.auth,
			...options,
		}),
	})
}
