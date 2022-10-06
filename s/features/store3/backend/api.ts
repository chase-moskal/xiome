
import * as renraku from "renraku"

import {StoreApiOptions} from "./types/options.js"
import {makeStorePolicies} from "./policies/policies.js"
import {makeBillingService} from "./services/billing.js"
import {makeConnectService} from "./services/connect.js"
import {makeSubscriptionObserverService} from "./services/subscriptions/observer.js"
import {makeSubscriptionShoppingService} from "./services/subscriptions/shopping.js"
import {makeSubscriptionPlanningService} from "./services/subscriptions/planning.js"

export function makeStoreApi<xMeta>(options: StoreApiOptions<xMeta>) {

	const serviceOptions = {
		...options,
		storePolicies: makeStorePolicies(options),
	}

	return renraku.api({
		connectService: makeConnectService(serviceOptions),
		billingService: makeBillingService(serviceOptions),
		subscriptionPlanningService: makeSubscriptionPlanningService(serviceOptions),
		subscriptionShoppingService: makeSubscriptionShoppingService(serviceOptions),
		subscriptionObserverService: makeSubscriptionObserverService(serviceOptions),
	})
}
