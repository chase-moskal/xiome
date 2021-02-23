
import {payPolicies} from "./policies/pay-policies.js"
import {apiContext} from "renraku/x/api/api-context.js"
import {premiumTopic} from "../topics/premium-topic.js"
import {PayApiOptions} from "./types/pay-api-options.js"
import {PayUserAuth} from "./policies/types/contexts/pay-user-auth.js"
import {PayUserMeta} from "./policies/types/contexts/pay-user-meta.js"
import {stripeAccountsTopic} from "../topics/stripe-accounts-topic.js"
import {stripeAccountLiaison as makeStripeAccountLiaison} from "../stripe/stripe-account-liaison.js"

export const payApi = ({rando, stripe, rawPayTables, verifyToken}: PayApiOptions) => {
	const policies = payPolicies({rawPayTables, verifyToken})

	const stripeAccountLiaison = makeStripeAccountLiaison({
		stripe,
		reauthLink: "todo_fake_url",
		returnLink: "todo_fake_url",
	})

	return {
		stripeAccountsService: apiContext<PayUserMeta, PayUserAuth>()({
			policy: policies.payUser,
			expose: stripeAccountsTopic({
				rando,
				stripeAccountLiaison,
			}),
		}),
		premiumService: apiContext<PayUserMeta, PayUserAuth>()({
			policy: policies.payUser,
			expose: premiumTopic({
				rando,
				stripeAccountLiaison,
			}),
		}),
	}
}
