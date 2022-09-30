
import * as renraku from "renraku"

import {StoreServiceOptions} from "../types.js"
import {SubscriptionPricingDraft, SubscriptionTierDraft} from "./planning/planning-types.js"
import {validateId} from "../../../../common/validators/validate-id.js"
import {determineConnectStatus} from "./helpers/utils/determine-connect-status.js"
import {fetchStripeConnectDetails} from "./helpers/fetch-stripe-connect-details.js"
import {runValidation} from "../../../../toolbox/topic-validation/run-validation.js"
import {helpersForManagingSubscriptions} from "./helpers/helpers-for-managing-subscriptions.js"
import {StripeConnectStatus, SubscriptionPlan, SubscriptionPricing, SubscriptionTier} from "../../types/store-concepts.js"
import {validateBoolean, validateLabel, validateNewPlanDraft, validateSubscriptionPricingDraft} from "./validators/planning-validators.js"

const hardcodedCurrency = "usd"
const hardcodedInterval = "month"

export const makeSubscriptionPlanningService = (
	options: StoreServiceOptions
) => renraku.service()

.policy(async(meta, headers) => {
	const auth = await options.storePolicies.storeLinkedPolicy(meta, headers)
	auth.checker.requirePrivilege("manage store")
	const connectStatus = determineConnectStatus(
		await fetchStripeConnectDetails({
			storeTables: auth.storeDatabase.tables,
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
			tier: SubscriptionTierDraft
		}): Promise<SubscriptionPlan> {

		const {planLabel, tier} = runValidation(inputs, validateNewPlanDraft)

		const {planId, tierId, tierRoleId, time, stripePriceId} =
			await helpers.createPlanAndTier({planLabel, tier})

		return {
			planId: planId.toString(),
			label: planLabel,
			time,
			archived: false,
			tiers: [
				{
					tierId: tierId.toString(),
					label: tier.label,
					roleId: tierRoleId.string,
					pricing: [{
						...tier.pricing,
						stripePriceId,
					}],
					time,
					active: true,
				}
			],
		}
	},

	async addTier(inputs: {
			label: string
			planId: string
			pricing: SubscriptionPricingDraft
		}) {

		const planId = runValidation(inputs.planId, validateId)
		const label = runValidation(inputs.label, validateLabel)
		const pricing = runValidation(inputs.pricing, validateSubscriptionPricingDraft)

		const {tierId, roleId, time, stripePriceId} = await helpers.createTierForPlan({
			label,
			planId,
			pricing,
		})

		const tier: SubscriptionTier = {
			tierId: tierId.toString(),
			roleId: roleId.toString(),
			active: true,
			label,
			pricing: [{...pricing, stripePriceId}],
			time,
		}

		return tier
	},

	async editPlan(inputs: {
			planId: string
			label: string
			archived: boolean
		}) {
		const planId = runValidation(inputs.planId, validateId)
		const label = runValidation(inputs.label, validateLabel)
		const archived = runValidation(inputs.archived, validateBoolean)
		await helpers.updatePlan({planId, label, archived})
	},

	async editTier(inputs: {
			label: string
			tierId: string
			active: boolean
			pricing: SubscriptionPricingDraft
		}) {

		debugger

		const label = runValidation(inputs.label, validateLabel)
		const tierId = runValidation(inputs.tierId, validateId)
		const active = runValidation(inputs.active, validateBoolean)
		const pricing = runValidation(inputs.pricing, validateSubscriptionPricingDraft)

		await helpers.updateTier({
			label,
			tierId,
			active,
			pricing,
		})
	},
}))
