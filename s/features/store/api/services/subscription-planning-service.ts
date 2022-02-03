
import * as renraku from "renraku"

import {StoreMeta} from "../../types/store-metas-and-auths.js"
import {fetchSubscriptionPlans} from "./helpers/fetch-subscription-plans.js"
import {determineConnectStatus} from "./helpers/utils/determine-connect-status.js"
import {fetchStripeConnectDetails} from "./helpers/fetch-stripe-connect-details.js"
import {helpersForListingSubscriptions} from "./helpers/helpers-for-listing-subscriptions.js"
import {helpersForManagingSubscriptions} from "./helpers/helpers-for-managing-subscriptions.js"
import {StoreServiceOptions, StripeConnectStatus, SubscriptionPlan} from "../../types/store-concepts.js"

const hardcodedCurrency = "usd"
const hardcodedInterval = "month"

export const makeSubscriptionPlanningService = (
	options: StoreServiceOptions
) => renraku.service()

.policy(async(meta: StoreMeta, headers) => {
	const auth = await options.storeLinkedPolicy(meta, headers)
	auth.checker.requirePrivilege("manage store")
	const connectStatus = determineConnectStatus(
		await fetchStripeConnectDetails({
			storeTables: auth.database.tables.store,
			stripeLiaison: auth.stripeLiaison,
		})
	)
	if (connectStatus !== StripeConnectStatus.Ready)
		throw new renraku.ApiError(400, "stripe connect status not ready")
	return auth
})

.expose(auth => ({

	async listSubscriptionPlans(): Promise<SubscriptionPlan[]> {
		return fetchSubscriptionPlans(auth)
	},

	async addPlan(inputs: {
			planLabel: string
			tierLabel: string
			tierPrice: number
		}): Promise<SubscriptionPlan> {

		const helpers = helpersForManagingSubscriptions({...options, ...auth})

		const stripeDetails = await helpers.createStripeProductAndPrice({
			...inputs,
			tierCurrency: hardcodedCurrency,
			tierInterval: hardcodedInterval,
		})

		const {planId, tierId, time} = await helpers.createPlanAndTier({
			...stripeDetails,
			...inputs,
		})

		return {
			planId: planId.toString(),
			label: inputs.planLabel,
			time,
			active: true,
			tiers: [
				{
					tierId: tierId.toString(),
					label: inputs.tierLabel,
					price: inputs.tierPrice,
					time,
					active: true,
				}
			],
		}
	},

	async addTier({}: {
			label: string
			price: number
			planId: string
		}) {
		return undefined
	},

	async editPlan() {},
	async editTier() {},
}))
