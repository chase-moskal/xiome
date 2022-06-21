
import * as renraku from "renraku"

import {StoreServiceOptions} from "../types.js"
import {fetchSubscriptionPlans} from "./helpers/fetch-subscription-plans.js"

export const makeSubscriptionObserverService = (
	options: StoreServiceOptions
) => renraku.service()

.policy(options.storePolicies.storeLinkedPolicy)

.expose(auth => ({

	async listSubscriptionPlans() {
		return fetchSubscriptionPlans(auth)
	},
}))
