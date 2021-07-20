
import {apiContext} from "renraku/x/api/api-context.js"
import {StoreServiceOptions} from "./types/store-service-options.js"
import {CustomerAuth, CustomerMeta} from "../policies/types/store-metas-and-auths.js"

export const makeShoppingService = (
		options: StoreServiceOptions
	) => apiContext<CustomerMeta, CustomerAuth>()({
	policy: options.storePolicies.customerPolicy,
	expose: {

		async buySubscription(
				{stripeLiaisonForApp, storeTables},
				{subscriptionPlanId}: {
					subscriptionPlanId: string
				}) {
			return true
		},

		async updateSubscription(
				{stripeLiaisonForApp, storeTables},
				{subscriptionId}: {
					subscriptionId: string
				}) {
			return true
		},

		async endSubscription(
				{stripeLiaisonForApp, storeTables},
				{subscriptionId}: {
					subscriptionId: string
				}) {
			return true
		},
	},
})
