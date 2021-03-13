
import {asTopic} from "renraku/x/identities/as-topic.js"
import {SubscriptionsManagerAuth} from "../api/policies/types/contexts/subscriptions-manager-auth.js"

export const subscriptionsManagementTopic = () => asTopic<SubscriptionsManagerAuth>()({

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
