
import * as renraku from "renraku"

import {StoreServiceOptions} from "../../types/options.js"
import {validateId} from "../../../../../common/validators/validate-id.js"
import {SubscriptionTierDraft, SubscriptionPricingDraft} from "./types/drafts.js"
import {SubscriptionPlan, SubscriptionTier} from "../../../isomorphic/concepts.js"
import {runValidation} from "../../../../../toolbox/topic-validation/run-validation.js"
import {validateNewPlanDraft, validateLabel, validateSubscriptionPricingDraft, validateBoolean} from "../../../isomorphic/validators.js"

export const makeSubscriptionPlanningService = (options: StoreServiceOptions) =>
renraku
.service()
.policy(options.storePolicies.merchant)
.expose(({helpers}) => ({

	async addPlan(inputs: {
			planLabel: string
			tier: SubscriptionTierDraft
		}): Promise<SubscriptionPlan> {

		const {planLabel, tier} = runValidation(inputs, validateNewPlanDraft)

		const {planId, tierId, tierRoleId, time, stripePriceId} =
			await helpers.createPlanAndTier({
				planLabel,
				tier,
			})

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

		const {tierId, roleId, time, stripePriceId} =
			await helpers.createTierForPlan({
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

		const label = runValidation(inputs.label, validateLabel)
		const tierId = runValidation(inputs.tierId, validateId)
		const active = runValidation(inputs.active, validateBoolean)
		const pricing = runValidation(inputs.pricing, validateSubscriptionPricingDraft)

		return helpers.updateTier({
			label,
			tierId,
			active,
			pricing,
		})
	},
}))
