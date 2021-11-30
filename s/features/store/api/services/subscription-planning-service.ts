
import {apiContext} from "renraku/x/api/api-context.js"
import {StoreServiceOptions} from "../../types/store-concepts.js"
import {StoreLinkedAuth, StoreMeta} from "../../types/store-metas-and-auths.js"

const hardcodedCurrency = "usd"
const hardcodedInterval = "month"

export const makeSubscriptionPlanningService = (
		options: StoreServiceOptions
	) => apiContext<StoreMeta, StoreLinkedAuth>()({

	async policy(meta, request) {
		const auth = await options.storeLinkedPolicy(meta, request)
		auth.checker.requirePrivilege("manage store")
		return auth
	},

	expose: {
		async listPlanningDetails() {},
		async addPlan() {},
		async addTier() {},
		async editPlan() {},
		async editTier() {},
	},
})
