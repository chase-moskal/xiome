
import {asTopic} from "renraku/x/identities/as-topic.js"
import {ClerkAuth} from "../api/policies/types/contexts/clerk-auth.js"

export const shopkeepingTopic = () => asTopic<ClerkAuth>()({

	async createSubscriptionPlan(
		{tables, stripeLiaisonForApp, checker},
		{userId}: {
			userId: string
		}) {
		return true
	},

	async updateSubscriptionPlan(
		{tables, stripeLiaisonForApp, checker},
		{subscriptionPlanId}: {
			subscriptionPlanId: string
		}) {
		return true
	},

	async deleteSubscriptionPlan(
		{tables, stripeLiaisonForApp, checker},
		{subscriptionPlanId}: {
			subscriptionPlanId: string
		}) {
		return true
	},
})
