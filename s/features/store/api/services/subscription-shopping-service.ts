
import {renrakuService} from "renraku"
import {StoreServiceOptions} from "../../types/store-concepts.js"

export const makeSubscriptionShoppingService = (
	options: StoreServiceOptions
) => renrakuService()

.policy(options.storeLinkedPolicy)

.expose(() => ({
	async loadSubscriptionPlans() {},
	async subscribeToTier() {},
	async unsubscribeFromTier() {},
}))
