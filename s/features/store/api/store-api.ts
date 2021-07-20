
import {apiContext} from "renraku/x/api/api-context.js"
import {shoppingTopic} from "../topics/shopping-topic.js"
import {StoreApiOptions} from "./types/store-api-options.js"
import {shopkeepingTopic} from "../topics/shopkeeping-topic.js"
import {stripeConnectTopic} from "../topics/stripe-connect-topic.js"

import {prepareStorePolicies} from "./policies/store-policies.js"
import {statusCheckerTopic} from "../topics/status-checker-topic.js"
import {statusTogglerTopic} from "../topics/status-toggler-topic.js"

export const storeApi = ({
		rando,
		config,
		authTables,
		storeTables,
		authPolicies,
		stripeComplex,
		shoppingOptions,
		stripeConnectOptions,
	}: StoreApiOptions) => {

	const policies = prepareStorePolicies({
		storeTables,
		authPolicies,
		stripeComplex,
	})

	return {
		stripeConnectService: apiContext<MerchantMeta, MerchantAuth>()({
			policy: policies.merchantPolicy,
			expose: stripeConnectTopic(stripeConnectOptions),
		}),
		shopkeepingService: apiContext<ClerkMeta, ClerkAuth>()({
			policy: policies.clerkPolicy,
			expose: shopkeepingTopic({
				generateId: () => rando.randomId(),
			}),
		}),
		shoppingService: apiContext<CustomerMeta, CustomerAuth>()({
			policy: policies.customerPolicy,
			expose: shoppingTopic(shoppingOptions),
		}),
		ecommerce: {
			statusTogglerService: apiContext<ClerkMeta, ClerkAuth>()({
				policy: policies.clerkPolicy,
				expose: statusTogglerTopic(),
			}),
			statusCheckerService: apiContext<ProspectMeta, ProspectAuth>()({
				policy: policies.prospectPolicy,
				expose: statusCheckerTopic({config}),
			}),
		}
	}
}
