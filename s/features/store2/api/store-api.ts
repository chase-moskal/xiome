
import * as renraku from "renraku"

import {StoreApiOptions} from "./types.js"
import {makeStorePolicies} from "./policies/store-policies.js"
import {makeConnectService} from "./services/connect-service.js"

export function makeStoreApi(options: StoreApiOptions) {
	const serviceOptions = {...options, storePolicies: makeStorePolicies(options)}
	return renraku.api({
		connectService: makeConnectService(serviceOptions),
		billingService: makeBillingService(serviceOptions),
		subscriptionPlanningService: makeSubscriptionPlanningService(serviceOptions),
		subscriptionShoppingService: makeSubscriptionShoppingService(serviceOptions),
		subscriptionObserverService: makeSubscriptionObserverService(serviceOptions),
	})
}
