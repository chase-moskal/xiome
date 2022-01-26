
import * as renraku from "renraku"

import {makeConnectService} from "./services/connect-service.js"
import {makeBillingService} from "./services/billing-service.js"
import {StoreAuth, StoreMeta} from "../types/store-metas-and-auths.js"
import {determineConnectStatus} from "./services/helpers/utils/determine-connect-status.js"
import {makeSubscriptionPlanningService} from "./services/subscription-planning-service.js"
import {makeSubscriptionShoppingService} from "./services/subscription-shopping-service.js"
import {fetchStripeConnectDetails} from "./services/helpers/fetch-stripe-connect-details.js"
import {StoreApiOptions, StoreServiceOptions, StripeConnectStatus} from "../types/store-concepts.js"

export const storeApi = ({
		stripeLiaison,
		basePolicy,
		...common
	}: StoreApiOptions) => {

	async function storePolicy(
			meta: StoreMeta,
			headers: renraku.HttpHeaders
		): Promise<StoreAuth> {
		const auth = await basePolicy(meta, headers)
		return {
			...auth,
			stripeLiaison,
		}
	}

	const serviceOptions: StoreServiceOptions = {
		...common,
		storePolicy,
		async storeLinkedPolicy(meta, headers) {
			const auth = await storePolicy(meta, headers)
			const connectDetails = await fetchStripeConnectDetails({
				storeTables: auth.database.tables.store,
				stripeLiaison: auth.stripeLiaison,
			})
			const connectStatus = determineConnectStatus(connectDetails)
			if (connectStatus !== StripeConnectStatus.Ready)
				throw new renraku.ApiError(
					400,
					"stripe account is not connected, and this action requires it"
				)
			return {
				...auth,
				stripeAccountId: connectDetails.stripeAccountId,
				stripeLiaisonAccount:
					stripeLiaison.account(connectDetails.stripeAccountId),
			}
		},
	}

	return renraku.api({
		connectService: makeConnectService(serviceOptions),
		subscriptionPlanningService: makeSubscriptionPlanningService(serviceOptions),
		subscriptionShoppingService: makeSubscriptionShoppingService(serviceOptions),
		billingService: makeBillingService(serviceOptions),
	})
}
