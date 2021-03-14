
import {apiContext} from "renraku/x/api/api-context.js"

import {payPolicies} from "./policies/store-policies.js"
import {MerchantAuth} from "./policies/types/contexts/merchant-auth.js"
import {MerchantMeta} from "./policies/types/contexts/merchant-meta.js"
import {CustomerMeta} from "./policies/types/contexts/customer-meta.js"
import {CustomerAuth} from "./policies/types/contexts/customer-auth.js"

import {stripeAccountsTopic} from "../topics/stripe-accounts-topic.js"
import {subscriptionsShopTopic} from "../topics/subscriptions-shop-topic.js"

import {PayApiOptions} from "./types/store-api-options.js"
import {subscriptionsManagementTopic} from "../topics/subscriptions-management-topic.js"

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
		stripeAccountsService: apiContext<MerchantMeta, MerchantAuth>()({
			policy: policies.merchant,
			expose: stripeAccountsTopic(),
		}),
		subscriptionsManagementService: apiContext<CustomerMeta, CustomerAuth>()({
			policy: policies.manager,
			expose: subscriptionsManagementTopic(),
		}),
		subscriptionsShopService: apiContext<CustomerMeta, CustomerAuth>()({
			policy: policies.customer,
			expose: subscriptionsShopTopic(),
		}),
	}
}
