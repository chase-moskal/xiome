
import * as dbmage from "dbmage"
import * as renraku from "renraku"

import {StoreMeta} from "../../types/store-metas-and-auths.js"
import {determineConnectStatus} from "./helpers/utils/determine-connect-status.js"
import {fetchStripeConnectDetails} from "./helpers/fetch-stripe-connect-details.js"
import {StoreServiceOptions, StripeConnectStatus, SubscriptionPlan, SubscriptionTier} from "../../types/store-concepts.js"
import {helpersForManagingSubscriptions} from "./helpers/helpers-for-managing-subscriptions.js"
import {SubscriptionTierRow} from "../../types/store-schema.js"

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

		const {
			planId, tierId, planRoleId, tierRoleId, time,
		} = await helpers.createPlanAndTier({
			...stripeDetails,
			...inputs,
		})

		return {
			planId: planId.toString(),
			label: inputs.planLabel,
			roleId: planRoleId.string,
			time,
			active: true,
			tiers: [
				{
					tierId: tierId.toString(),
					label: inputs.tierLabel,
					roleId: tierRoleId.string,
					price: inputs.tierPrice,
					time,
					active: true,
				}
			],
		}
	},

	async addTier({
			label, price, planId, currency, interval
		}: {
			label: string
			price: number
			planId: string
			currency: "usd"
			interval: "month" | "year"
		}) {

		const helpers = helpersForManagingSubscriptions({...options, ...auth})
		const {tierId, roleId, time} = await helpers.createTierForPlan({
			price,
			planId,
			tierLabel: label,
			tierInterval: interval,
			tierCurrency: currency,
		})

		const tier: SubscriptionTier = {
			tierId: tierId.toString(),
			roleId: roleId.toString(),
			active: true,
			label,
			price,
			time,
		}

		return tier
	},

	async editPlan() {},
	async editTier() {},
}))
