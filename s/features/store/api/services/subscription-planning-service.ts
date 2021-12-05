
import {ApiError} from "renraku/x/api/api-error.js"
import {apiContext} from "renraku/x/api/api-context.js"

import {StoreLinkedAuth, StoreMeta} from "../../types/store-metas-and-auths.js"
import {determineConnectStatus} from "./helpers/utils/determine-connect-status.js"
import {fetchStripeConnectDetails} from "./helpers/fetch-stripe-connect-details.js"
import {helpersForListingSubscriptions} from "./helpers/helpers-for-listing-subscriptions.js"
import {helpersForManagingSubscriptions} from "./helpers/helpers-for-managing-subscriptions.js"
import {StoreServiceOptions, StripeConnectStatus, SubscriptionPlan} from "../../types/store-concepts.js"

const hardcodedCurrency = "usd"
const hardcodedInterval = "month"

export const makeSubscriptionPlanningService = (
		options: StoreServiceOptions
	) => apiContext<StoreMeta, StoreLinkedAuth>()({

	async policy(meta, request) {
		const auth = await options.storeLinkedPolicy(meta, request)
		auth.checker.requirePrivilege("manage store")
		const connectStatus = determineConnectStatus(
			await fetchStripeConnectDetails({
				storeTables: auth.storeTables,
				stripeLiaison: auth.stripeLiaison,
			})
		)
		if (connectStatus !== StripeConnectStatus.Ready)
			throw new ApiError(400, "stripe connect status not ready")
		return auth
	},

	expose: {

		async listSubscriptionPlans(auth): Promise<SubscriptionPlan[]> {
			const helpers = helpersForListingSubscriptions(auth)

			const planRows = await helpers.fetchOurSubscriptionPlanRecords()
			const planCross = await helpers.crossReferencePlansWithStripeProducts(planRows)
			await helpers.deletePlans(planCross.missingIds)

			const tierRows = await helpers.fetchOurRecordsOfPlanTiers(planCross.presentIds)
			const tierCross = await helpers.crossReferenceTiersWithStripePrices(tierRows)

			const parentlessTierIds = helpers.identifyTiersWithoutParentPlan(tierRows, planCross.presentIds)
			const tiersIdsToDelete = helpers.dedupeIds([...tierCross.missingIds, ...parentlessTierIds])
			await helpers.deleteTiers(tiersIdsToDelete)

			return helpers.assembleSubscriptionPlans({
				plans: {rows: planRows, cross: planCross},
				tiers: {rows: tierRows, cross: tierCross},
			})
		},

		async addPlan(auth, inputs: {
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

		async addTier({stripeLiaisonAccount}, {}: {
				label: string
				price: number
				planId: string
			}) {
			return undefined
		},

		async editPlan() {},
		async editTier() {},
	},
})
