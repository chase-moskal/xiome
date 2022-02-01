
import * as renraku from "renraku"
import {StoreServiceOptions} from "../../types/store-concepts.js"
import {fetchSubscriptionPlans} from "./helpers/fetch-subscription-plans.js"

export const makeSubscriptionShoppingService = (
	options: StoreServiceOptions
) => renraku.service()

.policy(options.storeLinkedPolicy)

.expose(auth => ({

	async loadSubscriptionPlans() {
		return fetchSubscriptionPlans(auth)
	},

	async subscribeToTier() {},

	async unsubscribeFromTier() {},
}))
