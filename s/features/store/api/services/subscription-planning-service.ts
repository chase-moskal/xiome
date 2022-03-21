
import * as dbmage from "dbmage"
import * as renraku from "renraku"

import {StoreMeta} from "../../types/store-metas-and-auths.js"
import {validateId} from "../../../../common/validators/validate-id.js"
import {determineConnectStatus} from "./helpers/utils/determine-connect-status.js"
import {fetchStripeConnectDetails} from "./helpers/fetch-stripe-connect-details.js"
import {runValidation} from "../../../../toolbox/topic-validation/run-validation.js"
import {helpersForManagingSubscriptions} from "./helpers/helpers-for-managing-subscriptions.js"
import {StoreServiceOptions, StripeConnectStatus, SubscriptionPlan, SubscriptionTier} from "../../types/store-concepts.js"
import {validateBoolean, validateCurrency, validateInterval, validateLabel, validatePriceNumber} from "./validators/planning-validators.js"

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

		const planLabel = runValidation(inputs.planLabel, validateLabel)
		const tierLabel = runValidation(inputs.tierLabel, validateLabel)
		const tierPrice = runValidation(inputs.tierPrice, validatePriceNumber)

		const helpers = helpersForManagingSubscriptions({...options, ...auth})

		const stripeDetails = await helpers.createStripeProductAndPrice({
			planLabel,
			tierPrice,
			tierCurrency: hardcodedCurrency,
			tierInterval: hardcodedInterval,
		})

		const {
			planId, tierId, planRoleId, tierRoleId, time,
		} = await helpers.createPlanAndTier({
			...stripeDetails,
			planLabel,
			tierLabel,
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

	async addTier(inputs: {
			label: string
			price: number
			planId: string
			currency: "usd"
			interval: "month" | "year"
		}) {

		const planId = runValidation(inputs.planId, validateId)
		const label = runValidation(inputs.label, validateLabel)
		const price = runValidation(inputs.price, validatePriceNumber)
		const currency = runValidation(inputs.currency, validateCurrency)
		const interval = runValidation(inputs.interval, validateInterval)

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

	async editPlan(inputs: {
			planId: string
			label: string
			active: boolean
		}) {
		const planId = runValidation(inputs.planId, validateId)
		const label = runValidation(inputs.label, validateLabel)
		const active = runValidation(inputs.active, validateBoolean)
		const helpers = helpersForManagingSubscriptions({...options, ...auth})
		await helpers.updatePlan({planId, label, active})
	},

	async editTier(inputs: {
			label: string
			price: number
			tierId: string
			active: boolean
			currency: "usd"
			interval: "month" | "year"
		}) {

		const label = runValidation(inputs.label, validateLabel)
		const price = runValidation(inputs.price, validatePriceNumber)
		const tierId = runValidation(inputs.tierId, validateId)
		const currency = runValidation(inputs.currency, validateCurrency)
		const interval = runValidation(inputs.interval, validateInterval)
		const active = runValidation(inputs.active, validateBoolean)

		const helpers = helpersForManagingSubscriptions({...options, ...auth})
		await helpers.updateTier({
			label,
			price,
			tierId,
			currency,
			interval,
			active,
		})
	},
}))
