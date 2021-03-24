
import {asTopic} from "renraku/x/identities/as-topic.js"
import {CustomerAuth} from "../api/policies/types/contexts/customer-auth.js"

export const shoppingTopic = () => asTopic<CustomerAuth>()({

	async buySubscription(
			{tables, appStripeLiaison},
			{subscriptionPlanId}: {
				subscriptionPlanId: string
			}) {
		return true
	},

	async updateSubscription(
			{tables, appStripeLiaison},
			{subscriptionId}: {
				subscriptionId: string
			}) {
		return true
	},

	async endSubscription(
			{tables, appStripeLiaison},
			{subscriptionId}: {
				subscriptionId: string
			}) {
		return true
	},
})
