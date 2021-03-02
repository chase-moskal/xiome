
import {apiContext} from "renraku/x/api/api-context.js"

import {payPolicies} from "./policies/pay-policies.js"
import {premiumTopic} from "../topics/premium-topic.js"
import {stripeAccountsTopic} from "../topics/stripe-accounts-topic.js"

import {PayApiOptions} from "./types/pay-api-options.js"
import {UserMeta} from "../../auth/policies/types/user-meta.js"
import {PayUserAuth} from "./policies/types/contexts/pay-user-auth.js"
import {PayAppOwnerAuth} from "./policies/types/contexts/pay-app-owner-auth.js"

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
		stripeAccountsService: apiContext<UserMeta, PayAppOwnerAuth>()({
			policy: policies.appOwner,
			expose: stripeAccountsTopic(),
		}),
		premiumService: apiContext<UserMeta, PayUserAuth>()({
			policy: policies.user,
			expose: premiumTopic(),
		}),
	}
}
