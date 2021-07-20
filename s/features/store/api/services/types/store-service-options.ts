
import {DamnId} from "../../../../../toolbox/damnedb/damn-id.js"
import {prepareStorePolicies} from "../../policies/store-policies.js"
import {SecretConfig} from "../../../../../assembly/backend/types/secret-config.js"

export interface StoreServiceOptions {
	config: SecretConfig
	storePolicies: ReturnType<typeof prepareStorePolicies>
	accountReturningLinks: {
		refresh: string
		return: string
	}
	generateId: () => DamnId
}
