
import {asTopic} from "renraku/x/identities/as-topic.js"
import {ShoppingOptions} from "./types/shopping-options.js"
import {CustomerAuth} from "../api/policies/types/contexts/customer-auth.js"

export const shoppingTopic = ({
			checkoutReturningLinks
		}: ShoppingOptions) => asTopic<CustomerAuth>()({

	async buySubscription(
			{tables, stripeLiaisonForApp},
			{subscriptionPlanId}: {
				subscriptionPlanId: string
			}) {
		return true
	},

	async updateSubscription(
			{tables, stripeLiaisonForApp},
			{subscriptionId}: {
				subscriptionId: string
			}) {
		return true
	},

	async endSubscription(
			{tables, stripeLiaisonForApp},
			{subscriptionId}: {
				subscriptionId: string
			}) {
		return true
	},
})
