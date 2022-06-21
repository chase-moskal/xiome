
import * as renraku from "renraku"

import {StoreApiOptions} from "./types.js"
import {makeStorePolicies} from "./policies/store-policies.js"
import {makeConnectService} from "./services/connect-service.js"
import {makeBillingService} from "./services/billing-service.js"
import {makeSubscriptionPlanningService} from "./services/subscription-planning-service.js"
import {makeSubscriptionShoppingService} from "./services/subscription-shopping-service.js"
import {makeSubscriptionObserverService} from "./services/subscription-observer-service.js"

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
