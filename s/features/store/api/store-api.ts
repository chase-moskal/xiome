
import * as dbmage from "dbmage"
import * as renraku from "renraku"

import {makeConnectService} from "./services/connect-service.js"
import {makeBillingService} from "./services/billing-service.js"
import {StoreAuth, StoreMeta} from "../types/store-metas-and-auths.js"
import {determineConnectStatus} from "./services/helpers/utils/determine-connect-status.js"
import {makeSubscriptionPlanningService} from "./services/subscription-planning-service.js"
import {makeSubscriptionShoppingService} from "./services/subscription-shopping-service.js"
import {makeSubscriptionObserverService} from "./services/subscription-observer-service.js"
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

	async function storeLinkedPolicy(
			meta: StoreMeta,
			headers: renraku.HttpHeaders,
		) {
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
		const stripeLiaisonAccount = stripeLiaison.account(connectDetails.stripeAccountId)

		return {
			...auth,
			stripeLiaisonAccount,
			stripeAccountId: connectDetails.stripeAccountId,
		}
	}

	async function storeCustomerPolicy(
			meta: StoreMeta,
			headers: renraku.HttpHeaders,
		) {
		const auth = await storeLinkedPolicy(meta, headers)

		if (!auth.access.user) {
			throw new renraku.ApiError(400, "user is not logged in")
		}

		const userId = dbmage.Id.fromString(auth.access.user.userId)
		let customerRow = await auth.database.tables.store.billing
			.customers.readOne(dbmage.find({userId}))
		if (!customerRow) {
			const {id: stripeCustomerId} = await auth.stripeLiaisonAccount.customers.create({})
			customerRow = {
				userId,
				stripeCustomerId,
			}
			await auth.database.tables.store.billing.customers.create(customerRow)
		}
		const {stripeCustomerId} = customerRow

		return {
			...auth,
			stripeCustomerId,
		}
	}

	const serviceOptions: StoreServiceOptions = {
		...common,
		storePolicy,
		storeLinkedPolicy,
		storeCustomerPolicy,
	}

	return renraku.api({
		connectService: makeConnectService(serviceOptions),
		billingService: makeBillingService(serviceOptions),
		subscriptionPlanningService: makeSubscriptionPlanningService(serviceOptions),
		subscriptionShoppingService: makeSubscriptionShoppingService(serviceOptions),
		subscriptionObserverService: makeSubscriptionObserverService(serviceOptions),
	})
}
