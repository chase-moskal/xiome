
import {apiContext} from "renraku/x/api/api-context.js"
import {StoreServiceOptions} from "../../types/store-concepts.js"
import {StoreLinkedAuth, StoreMeta} from "../../types/store-metas-and-auths.js"

export const makeSubscriptionShoppingService = (
		options: StoreServiceOptions
	) => apiContext<StoreMeta, StoreLinkedAuth>()({

	policy: options.storeLinkedPolicy,

	expose: {
		async loadSubscriptionPlans() {},
		async subscribeToTier() {},
		async unsubscribeFromTier() {},
	},
})
