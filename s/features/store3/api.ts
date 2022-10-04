
import * as renraku from "renraku"

import {StoreApiOptions} from "./backend/types/options.js"
import {makeStorePolicies} from "./backend/policies/policies.js"
import {makeBillingService} from "./aspects/billing/service.js"
import {makeConnectService} from "./aspects/connect/service.js"
import {makeSubscriptionObserverService} from "./aspects/subscriptions/observer/service.js"
import {makeSubscriptionPlanningService} from "./aspects/subscriptions/planning/service.js"
import {makeSubscriptionShoppingService} from "./aspects/subscriptions/shopping/service.js"

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
