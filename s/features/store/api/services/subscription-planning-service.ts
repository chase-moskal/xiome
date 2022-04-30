
import * as dbmage from "dbmage"
import * as renraku from "renraku"

import {StoreMeta} from "../../types/store-metas-and-auths.js"
import {validateId} from "../../../../common/validators/validate-id.js"
import {determineConnectStatus} from "./helpers/utils/determine-connect-status.js"
import {fetchStripeConnectDetails} from "./helpers/fetch-stripe-connect-details.js"
import {runValidation} from "../../../../toolbox/topic-validation/run-validation.js"
import {helpersForManagingSubscriptions} from "./helpers/helpers-for-managing-subscriptions.js"
import {SubscriptionPricing, StoreServiceOptions, StripeConnectStatus, SubscriptionPlan, SubscriptionTier} from "../../types/store-concepts.js"
import {validateBoolean, validateCurrency, validateInterval, validateLabel, validatePriceNumber, validateSubscriptionPricing} from "./validators/planning-validators.js"
import {SubscriptionCurrency} from "../../types/store-schema.js"

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
	const helpers = helpersForManagingSubscriptions({...options, ...auth})
	return {...auth, helpers}
})

.expose(({helpers}) => ({

	async addPlan(inputs: {
			planLabel: string
			tierLabel: string
			pricing: SubscriptionPricing
			currency: SubscriptionCurrency
		}): Promise<SubscriptionPlan> {

		const planLabel = runValidation(inputs.planLabel, validateLabel)
		const tierLabel = runValidation(inputs.tierLabel, validateLabel)
		const pricing = runValidation(inputs.pricing, validateSubscriptionPricing)
		const currency = runValidation(inputs.currency, validateCurrency)

		const {planId, tierId, tierRoleId, time} =
			await helpers.createPlanAndTier({
				planLabel,
				tierLabel,
				pricing,
			})

		return {
			planId: planId.toString(),
			label: planLabel,
			time,
			active: true,
			tiers: [
				{
					tierId: tierId.toString(),
					label: tierLabel,
					roleId: tierRoleId.string,
					pricing,
					time,
					active: true,
				}
			],
		}
	},

	async addTier(inputs: {
			label: string
			planId: string
			pricing: SubscriptionPricing
		}) {

		const planId = runValidation(inputs.planId, validateId)
		const label = runValidation(inputs.label, validateLabel)
		const pricing = runValidation(inputs.pricing, validateSubscriptionPricing)

		const {tierId, roleId, time} = await helpers.createTierForPlan({
			label,
			planId,
			pricing: pricing,
		})

		const tier: SubscriptionTier = {
			tierId: tierId.toString(),
			roleId: roleId.toString(),
			active: true,
			label,
			pricing,
			time,
		}

		return tier
	},

	async editPlan(inputs: {
			planId: string
			label: string
		}) {
		const planId = runValidation(inputs.planId, validateId)
		const label = runValidation(inputs.label, validateLabel)
		await helpers.updatePlan({planId, label})
	},

	async editTier(inputs: {
			label: string
			tierId: string
			active: boolean
			pricing: SubscriptionPricing
		}) {

		const label = runValidation(inputs.label, validateLabel)
		const tierId = runValidation(inputs.tierId, validateId)
		const active = runValidation(inputs.active, validateBoolean)
		const pricing = runValidation(inputs.pricing, validateSubscriptionPricing)

		await helpers.updateTier({
			label,
			tierId,
			active,
			pricing,
		})
	},
}))
