
import {payPolicies} from "./pay-policies.js"
import {apiContext} from "renraku/x/api/api-context.js"
import {premiumTopic} from "../topics/premium-topic.js"
import {payTableBakery} from "./bakery/pay-table-bakery.js"
import {PayApiOptions} from "../types/api/pay-api-options.js"
import {PayUserAuth} from "../types/policies/contexts/pay-user-auth.js"
import {PayUserMeta} from "../types/policies/contexts/pay-user-meta.js"

export const payApi = ({rando, rawPayTables, verifyToken}: PayApiOptions) => {
	const bakePayTables = payTableBakery({rawPayTables})
	const policies = payPolicies({bakePayTables, verifyToken})

	return {
		premiumService: apiContext<PayUserMeta, PayUserAuth>()({
			policy: policies.payUser,
			expose: premiumTopic({rando}),
		})
	}
}
