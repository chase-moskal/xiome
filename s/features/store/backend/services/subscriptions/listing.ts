
import * as renraku from "renraku"
import {StoreServiceOptions} from "../../types/options.js"
import {fetchSubscriptionPlans} from "../../utils/fetch-subscription-plans.js"

export const makeSubscriptionListingService = (
	options: StoreServiceOptions
) => renraku.service()

.policy(options.storePolicies.storeLinkedPolicy)

.expose(auth => ({

	async listPlans() {
		return fetchSubscriptionPlans(auth)
	},
}))
