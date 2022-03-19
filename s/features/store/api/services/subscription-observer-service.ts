
import * as renraku from "renraku"

import {StoreServiceOptions} from "../../types/store-concepts.js"
import {fetchSubscriptionPlans} from "./helpers/fetch-subscription-plans.js"

export const makeSubscriptionObserverService = (
	options: StoreServiceOptions
) => renraku.service()

.policy(options.storeLinkedPolicy)

.expose(auth => ({

	async listSubscriptionPlans() {
		return fetchSubscriptionPlans(auth)
	},
}))
