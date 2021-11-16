
import {asApi} from "renraku/x/identities/as-api.js"

import {StoreApiOptions} from "./types/store-options.js"
import {StoreServiceOptions} from "./types/store-options.js"
import {prepareStorePolicies} from "./policies/store-policies.js"
import {makeShoppingService} from "./services/shopping-service.js"
import {makeShopkeepingService} from "./services/shopkeeping-service.js"
import {makeStripeConnectService} from "./services/stripe-connect-service.js"
import {makeStatusTogglerService} from "./services/status-toggler-service.js"
import {makeStatusCheckerService} from "./services/status-checker-service.js"

export const storeApi = ({
		config,
		storeTables,
		authPolicies,
		stripeComplex,
		accountReturningLinks,
		checkoutReturningLinks,
		generateId,
	}: StoreApiOptions) => {

	const storePolicies = prepareStorePolicies({
		storeTables,
		authPolicies,
		stripeComplex,
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
