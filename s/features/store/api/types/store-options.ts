
import {StoreTables} from "../tables/types/store-tables.js"
import {DamnId} from "../../../../toolbox/damnedb/damn-id.js"
import {prepareStorePolicies} from "../policies/store-policies.js"
import {StripeComplex} from "../../stripe2/types/stripe-complex.js"
import {SecretConfig} from "../../../../assembly/backend/types/secret-config.js"
import {prepareAuthPolicies} from "../../../auth2/policies/prepare-auth-policies.js"
import {UnconstrainedTables} from "../../../../framework/api/types/table-namespacing-for-apps.js"

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

export interface StoreApiOptions extends StoreCommonOptions {
	config: SecretConfig
	stripeComplex: StripeComplex
	storeTables: UnconstrainedTables<StoreTables>
	authPolicies: ReturnType<typeof prepareAuthPolicies>
}

export interface StoreServiceOptions extends StoreCommonOptions {
	storePolicies: ReturnType<typeof prepareStorePolicies>
}
