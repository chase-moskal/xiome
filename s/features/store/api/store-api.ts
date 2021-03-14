
import {apiContext} from "renraku/x/api/api-context.js"

import {payPolicies} from "./policies/store-policies.js"
import {MerchantAuth} from "./policies/types/contexts/merchant-auth.js"
import {MerchantMeta} from "./policies/types/contexts/merchant-meta.js"
import {CustomerMeta} from "./policies/types/contexts/customer-meta.js"
import {CustomerAuth} from "./policies/types/contexts/customer-auth.js"

import {stripeConnectTopic} from "../topics/stripe-connect-topic.js"
import {shoppingTopic} from "../topics/shopping-topic.js"

import {PayApiOptions} from "./types/store-api-options.js"
import {shopkeepingTopic} from "../topics/shopkeeping-topic.js"

export const storeApi = ({
			config,
			tables,
			verifyToken,
			makeStripeLiaison,
		}: PayApiOptions) => {

	const policies = payPolicies({
		tables,
		config,
		verifyToken,
		makeStripeLiaison,
	})

	return {
		stripeConnectService: apiContext<MerchantMeta, MerchantAuth>()({
			policy: policies.merchant,
			expose: stripeConnectTopic(),
		}),
		shopkeepingService: apiContext<CustomerMeta, CustomerAuth>()({
			policy: policies.clerk,
			expose: shopkeepingTopic(),
		}),
		shoppingService: apiContext<CustomerMeta, CustomerAuth>()({
			policy: policies.customer,
			expose: shoppingTopic(),
		}),
	}
}
