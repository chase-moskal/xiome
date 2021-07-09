
import {asTopic} from "renraku/x/identities/as-topic.js"
import {ShoppingOptions} from "./types/shopping-options.js"
import {CustomerAuth} from "../api/policies/types/contexts/customer-auth.js"

export const shoppingTopic = ({
			checkoutReturningLinks
		}: ShoppingOptions) => asTopic<CustomerAuth>()({

	async buySubscription(
			{tables, stripeLiaisonForApp},
			{id_subscriptionPlan}: {
				id_subscriptionPlan: string
			}) {
		return true
	},

	async updateSubscription(
			{tables, stripeLiaisonForApp},
			{id_subscription}: {
				id_subscription: string
			}) {
		return true
	},

	async endSubscription(
			{tables, stripeLiaisonForApp},
			{id_subscription}: {
				id_subscription: string
			}) {
		return true
	},
})
