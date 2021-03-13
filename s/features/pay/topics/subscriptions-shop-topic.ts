
import {asTopic} from "renraku/x/identities/as-topic.js"
import {CustomerAuth} from "../api/policies/types/contexts/customer-auth.js"

export const subscriptionsShopTopic = () => asTopic<CustomerAuth>()({

	async buySubscription(
			{tables, stripeLiaison},
			{subscriptionPlanId}: {
				subscriptionPlanId: string
			}) {
		return true
	},

	async updateSubscription(
			{tables, stripeLiaison},
			{subscriptionId}: {
				subscriptionId: string
			}) {
		return true
	},

	async cancelSubscription(
			{tables, stripeLiaison},
			{subscriptionId}: {
				subscriptionId: string
			}) {
		return true
	},
})
