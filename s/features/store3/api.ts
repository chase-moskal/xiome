
import * as renraku from "renraku"

import {StoreApiOptions} from "./backend/types/options.js"
import {makeStorePolicies} from "./backend/policies/policies.js"
import {makeBillingService} from "./backend/services/billing.js"
import {makeConnectService} from "./backend/services/connect.js"
import {makeSubscriptionObserverService} from "./backend/services/subscriptions/observer.js"
import {makeSubscriptionShoppingService} from "./backend/services/subscriptions/shopping.js"
import {makeSubscriptionPlanningService} from "./backend/services/subscriptions/planning.js"

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
