
import {apiContext} from "renraku/x/api/api-context.js"
import {shoppingTopic} from "../topics/shopping-topic.js"
import {StoreApiOptions} from "./types/store-api-options.js"
import {shopkeepingTopic} from "../topics/shopkeeping-topic.js"
import {stripeConnectTopic} from "../topics/stripe-connect-topic.js"

import {payPolicies} from "./policies/store-policies.js"
import {MerchantAuth} from "./policies/types/contexts/merchant-auth.js"
import {MerchantMeta} from "./policies/types/contexts/merchant-meta.js"
import {CustomerMeta} from "./policies/types/contexts/customer-meta.js"
import {CustomerAuth} from "./policies/types/contexts/customer-auth.js"
import {ClerkMeta} from "./policies/types/contexts/clerk-meta.js"
import {ClerkAuth} from "./policies/types/contexts/clerk-auth.js"

export const storeApi = ({
		rando,
		config,
		tables,
		stripeComplex,
		shoppingOptions,
		stripeConnectOptions,
		verifyToken,
	}: StoreApiOptions) => {

	const policies = payPolicies({
		tables,
		config,
		stripeComplex,
		verifyToken,
	})

	return {
		stripeConnectService: apiContext<MerchantMeta, MerchantAuth>()({
			policy: policies.merchant,
			expose: stripeConnectTopic(stripeConnectOptions),
		}),
		shopkeepingService: apiContext<ClerkMeta, ClerkAuth>()({
			policy: policies.clerk,
			expose: shopkeepingTopic({
				generateId: () => rando.randomId(),
			}),
		}),
		shoppingService: apiContext<CustomerMeta, CustomerAuth>()({
			policy: policies.customer,
			expose: shoppingTopic(shoppingOptions),
		}),
	}
}
