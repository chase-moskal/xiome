
import {asTopic} from "renraku/x/identities/as-topic.js"
import {ClerkAuth} from "../api/policies/types/contexts/clerk-auth.js"

export const shopkeepingTopic = () => asTopic<ClerkAuth>()({

	async createSubscriptionPlan(
			{tables, stripeLiaison},
			{userId}: {
				userId: string
			}) {
		return true
	},

	async updateSubscriptionPlan(
			{tables, stripeLiaison},
			{subscriptionPlanId}: {
				subscriptionPlanId: string
			}) {
		return true
	},

	async deleteSubscriptionPlan(
			{tables, stripeLiaison},
			{subscriptionPlanId}: {
				subscriptionPlanId: string
			}) {
		return true
	},
})
