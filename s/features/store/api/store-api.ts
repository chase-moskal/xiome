
import {ApiError} from "renraku/x/api/api-error.js"
import {asApi} from "renraku/x/identities/as-api.js"
import {HttpRequest} from "renraku/x/types/http/http-request.js"

import {DamnId} from "../../../toolbox/damnedb/damn-id.js"
import {makeConnectService} from "./services/connect-service.js"
import {makeBillingService} from "./services/billing-service.js"
import {StoreAuth, StoreMeta} from "../types/store-metas-and-auths.js"
import {StoreApiOptions, StoreServiceOptions} from "../types/store-concepts.js"
import {makeSubscriptionPlanningService} from "./services/subscription-planning-service.js"
import {makeSubscriptionShoppingService} from "./services/subscription-shopping-service.js"

export const storeApi = ({
		storeTables,
		stripeLiaison,
		basePolicy,
		...common
	}: StoreApiOptions) => {

	async function storePolicy(
			meta: StoreMeta,
			request: HttpRequest
		): Promise<StoreAuth> {
		const auth = await basePolicy(meta, request)
		return {
			...auth,
			stripeLiaison,
			storeTables: storeTables.namespaceForApp(
				DamnId.fromString(auth.access.appId)
			),
		}
	}

	const serviceOptions: StoreServiceOptions = {
		...common,
		storePolicy,
		async storeLinkedPolicy(meta, request) {
			const auth = await storePolicy(meta, request)
			const row = await auth.storeTables.merchant
				.stripeAccounts
					.one({conditions: false})
			if (!row)
				throw new ApiError(400, "store is not available")
			return {
				...auth,
				stripeLiaisonAccount: stripeLiaison.account(row.stripeAccountId),
			}
		},
	}

	return asApi({
		connectService: makeConnectService(serviceOptions),
		subscriptionPlanningService: makeSubscriptionPlanningService(serviceOptions),
		subscriptionShoppingService: makeSubscriptionShoppingService(serviceOptions),
		billingService: makeBillingService(serviceOptions),
	})
}
