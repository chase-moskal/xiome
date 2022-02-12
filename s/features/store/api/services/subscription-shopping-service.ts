
import * as renraku from "renraku"
import {StoreServiceOptions} from "../../types/store-concepts.js"
import {fetchSubscriptionPlans} from "./helpers/fetch-subscription-plans.js"

export const makeSubscriptionShoppingService = (
	options: StoreServiceOptions
) => renraku.service()

.policy(options.storeLinkedPolicy)

.expose(auth => ({

	async listSubscriptionPlans() {
		return fetchSubscriptionPlans(auth)
	},

	async purchaseSubscriptionTier() {
		// const session = await auth.stripeLiaisonAccount.checkout.sessions.create({
		// 	mode: "subscription",
		// 	line_items: {},
		// })
	},

	async unsubscribeFromTier() {},
}))
