
import {asApi} from "renraku/x/identities/as-api.js"

import {StoreTables} from "./tables/types/store-tables.js"
import {prepareStorePolicies} from "./policies/store-policies.js"
import {makeShoppingService} from "./services/shopping-service.js"
import {makeStripeLiaison} from "../stripe2/liaison/stripe-liaison.js"
import {makeShopkeepingService} from "./services/shopkeeping-service.js"
import {makeStripeConnectService} from "./services/stripe-connect-service.js"
import {makeStatusTogglerService} from "./services/status-toggler-service.js"
import {makeStatusCheckerService} from "./services/status-checker-service.js"
import {SecretConfig} from "../../../assembly/backend/types/secret-config.js"
import {prepareAuthPolicies} from "../../auth/policies/prepare-auth-policies.js"
import {StoreCommonOptions, StoreServiceOptions} from "./types/store-options.js"
import {UnconstrainedTables} from "../../../framework/api/types/table-namespacing-for-apps.js"

export const storeApi = ({
		config,
		storeTables,
		authPolicies,
		stripeLiaison,
		accountReturningLinks,
		checkoutReturningLinks,
		generateId,
	}: {
		config: SecretConfig
		storeTables: UnconstrainedTables<StoreTables>
		stripeLiaison: ReturnType<typeof makeStripeLiaison>
		authPolicies: ReturnType<typeof prepareAuthPolicies>
	} & StoreCommonOptions) => {

	const storePolicies = prepareStorePolicies({
		storeTables,
		authPolicies,
		stripeLiaison,
	})

	const serviceOptions: StoreServiceOptions = {
		config,
		storePolicies,
		accountReturningLinks,
		checkoutReturningLinks,
		generateId,
	}

	return asApi({
		stripeConnectService: makeStripeConnectService(serviceOptions),
		statusTogglerService: makeStatusTogglerService(serviceOptions),
		statusCheckerService: makeStatusCheckerService(serviceOptions),
		shopkeepingService: makeShopkeepingService(serviceOptions),
		shoppingService: makeShoppingService(serviceOptions),
	})
}
