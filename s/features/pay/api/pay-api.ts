
import {apiContext} from "renraku/x/api/api-context.js"

import {payPolicies} from "./policies/pay-policies.js"
import {premiumTopic} from "../topics/premium-topic.js"
import {stripeAccountsTopic} from "../topics/stripe-accounts-topic.js"

import {PayApiOptions} from "./types/pay-api-options.js"
import {MerchantAuth} from "./policies/types/contexts/merchant-auth.js"
import {MerchantMeta} from "./policies/types/contexts/merchant-meta.js"
import {CustomerMeta} from "./policies/types/contexts/customer-meta.js"
import {CustomerAuth} from "./policies/types/contexts/customer-auth.js"

export const payApi = ({
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
		premiumService: apiContext<CustomerMeta, CustomerAuth>()({
			policy: policies.customer,
			expose: premiumTopic(),
		}),
	}
}
