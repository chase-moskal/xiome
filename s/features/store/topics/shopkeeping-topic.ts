
import {asTopic} from "renraku/x/identities/as-topic.js"
import {ClerkAuth} from "../api/policies/types/contexts/clerk-auth.js"

export const shopkeepingTopic = () => asTopic<ClerkAuth>()({

	async createSubscriptionPlan(
		{tables, appStripeLiaison, checker},
		{userId}: {
			userId: string
		}) {

		await appStripeLiaison.products

		return true
	},

	async updateSubscriptionPlan(
		{tables, appStripeLiaison, checker},
		{subscriptionPlanId}: {
			subscriptionPlanId: string
		}) {
		return true
	},

	async deleteSubscriptionPlan(
		{tables, appStripeLiaison, checker},
		{subscriptionPlanId}: {
			subscriptionPlanId: string
		}) {
		return true
	},
})
