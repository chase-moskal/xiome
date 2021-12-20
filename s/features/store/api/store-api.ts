
import {renrakuApi, RenrakuError, RenrakuHttpHeaders} from "renraku"

import {DamnId} from "../../../toolbox/damnedb/damn-id.js"
import {makeConnectService} from "./services/connect-service.js"
import {makeBillingService} from "./services/billing-service.js"
import {StoreAuth, StoreMeta} from "../types/store-metas-and-auths.js"
import {determineConnectStatus} from "./services/helpers/utils/determine-connect-status.js"
import {makeSubscriptionPlanningService} from "./services/subscription-planning-service.js"
import {makeSubscriptionShoppingService} from "./services/subscription-shopping-service.js"
import {fetchStripeConnectDetails} from "./services/helpers/fetch-stripe-connect-details.js"
import {StoreApiOptions, StoreServiceOptions, StripeConnectStatus} from "../types/store-concepts.js"

export const storeApi = ({
		storeTables,
		stripeLiaison,
		basePolicy,
		...common
	}: StoreApiOptions) => {

	async function storePolicy(
			meta: StoreMeta,
			headers: RenrakuHttpHeaders
		): Promise<StoreAuth> {
		const auth = await basePolicy(meta, headers)
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
		async storeLinkedPolicy(meta, headers) {
			const auth = await storePolicy(meta, headers)
			const connectDetails = await fetchStripeConnectDetails({
				storeTables: auth.storeTables,
				stripeLiaison: auth.stripeLiaison,
			})
			const connectStatus = determineConnectStatus(connectDetails)
			if (connectStatus !== StripeConnectStatus.Ready)
				throw new RenrakuError(
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

	return renrakuApi({
		connectService: makeConnectService(serviceOptions),
		subscriptionPlanningService: makeSubscriptionPlanningService(serviceOptions),
		subscriptionShoppingService: makeSubscriptionShoppingService(serviceOptions),
		billingService: makeBillingService(serviceOptions),
	})
}
