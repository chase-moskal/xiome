
import {payPolicies} from "./policies/pay-policies.js"
import {apiContext} from "renraku/x/api/api-context.js"
import {premiumTopic} from "../topics/premium-topic.js"
import {PayApiOptions} from "./types/pay-api-options.js"
import {PayUserAuth} from "./policies/types/contexts/pay-user-auth.js"
import {PayUserMeta} from "./policies/types/contexts/pay-user-meta.js"
import {stripeAccountsTopic} from "../topics/stripe-accounts-topic.js"

export const payApi = ({rando, stripeLiaison, rawPayTables, verifyToken}: PayApiOptions) => {
	const policies = payPolicies({rawPayTables, verifyToken})

	return {
		stripeAccountsService: apiContext<PayUserMeta, PayUserAuth>()({
			policy: policies.payUser,
			expose: stripeAccountsTopic({
				rando,
				stripeLiaison,
			}),
		}),
		premiumService: apiContext<PayUserMeta, PayUserAuth>()({
			policy: policies.payUser,
			expose: premiumTopic({
				rando,
				stripeLiaison,
			}),
		}),
	}
}
