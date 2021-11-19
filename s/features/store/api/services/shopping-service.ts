
import {apiContext} from "renraku/x/api/api-context.js"
import {StoreServiceOptions} from "../types/store-options.js"
import {StoreLinkedAuth, StoreMeta} from "../policies/types/store-metas-and-auths.js"

export const makeShoppingService = (
		options: StoreServiceOptions
	) => apiContext<StoreMeta, StoreLinkedAuth>()({

	policy: options.storeLinkedPolicy,

	expose: {

		async buySubscription(
				{stripeLiaisonAccount, storeTables},
				{subscriptionPlanId}: {
					subscriptionPlanId: string
				}) {
			return true
		},

		async updateSubscription(
				{stripeLiaisonAccount, storeTables},
				{subscriptionId}: {
					subscriptionId: string
				}) {
			return true
		},

		async endSubscription(
				{stripeLiaisonAccount, storeTables},
				{subscriptionId}: {
					subscriptionId: string
				}) {
			return true
		},
	},
})
