
import {DamnId} from "../../../../toolbox/damnedb/damn-id.js"
import {prepareStorePolicies} from "../policies/store-policies.js"
import {SecretConfig} from "../../../../assembly/backend/types/secret-config.js"

export interface StoreCommonOptions {
	config: SecretConfig
	accountReturningLinks: {
		refresh: string
		return: string
	}
	checkoutReturningLinks: {
		cancel: string
		success: string
	}
	generateId: () => DamnId
}

export interface StoreServiceOptions extends StoreCommonOptions {
	storePolicies: ReturnType<typeof prepareStorePolicies>
}
