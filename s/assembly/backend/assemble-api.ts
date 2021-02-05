
import {asApi} from "renraku/x/identities/as-api.js"
import {makeAuthApi} from "../../features/auth/auth-api.js"
import {ApiOptions} from "../types/backend/system-api-options.js"

export function assembleApi(options: ApiOptions) {
	return asApi({
		auth: makeAuthApi({
			authTables: options.tables.auth,
			...options,
		}),
	})
}
