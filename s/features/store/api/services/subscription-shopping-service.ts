
import * as renraku from "renraku"
import {StoreServiceOptions} from "../../types/store-concepts.js"

export const makeSubscriptionShoppingService = (
	options: StoreServiceOptions
) => renraku.service()

.policy(options.storeLinkedPolicy)

.expose(() => ({
	async loadSubscriptionPlans() {},
	async subscribeToTier() {},
	async unsubscribeFromTier() {},
}))
