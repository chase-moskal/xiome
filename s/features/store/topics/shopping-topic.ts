
import {asTopic} from "renraku/x/identities/as-topic.js"
import {CustomerAuth} from "../api/policies/types/contexts/customer-auth.js"

export const shoppingTopic = () => asTopic<CustomerAuth>()({

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

	async endSubscription(
			{tables, stripeLiaison},
			{subscriptionId}: {
				subscriptionId: string
			}) {
		return true
	},
})
