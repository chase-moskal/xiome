
import {objectMap, unproxy} from "@chasemoskal/snapstate"

import {ops} from "../../../../framework/ops.js"
import {StripePopups} from "../../popups/types.js"
import {StoreServices} from "../../frontend/types.js"
import {StoreStateSystem} from "../../frontend/state.js"
import {SubscriptionTierDraft, SubscriptionPricingDraft} from "../../backend/services/subscriptions/types/drafts.js"

export function makeSubscriptionsSubmodel({
		services,
		stateSystem,
		stripePopups,
		reauthorize,
	}: {
		services: StoreServices
		stateSystem: StoreStateSystem
		stripePopups: StripePopups
		reauthorize: () => Promise<void>
	}) {

	const state = stateSystem.snap.writable
	const {get} = stateSystem

	async function load() {
		state.subscriptions.subscriptionPlansOp = ops.none()
		state.subscriptions.mySubscriptionDetailsOp = ops.none()
		if (get.is.storeActive) {
			await ops.operation({
				setOp: op => state.subscriptions.subscriptionPlansOp = op,
				promise: services.subscriptionObserver.listSubscriptionPlans(),
			})
			if (get.is.userLoggedIn) {
				await ops.operation({
					setOp: op => state.subscriptions.mySubscriptionDetailsOp = op,
					promise: services.subscriptionShopping.fetchMySubscriptionDetails(),
				})
			}
		}
	}

	const actions = {

		async purchase({stripePriceId, showLoadingSpinner}: {
				stripePriceId: string
				showLoadingSpinner?: boolean
			}) {

			if (showLoadingSpinner)
				state.subscriptions.mySubscriptionDetailsOp = ops.loading()

			const {checkoutDetails} = await services.subscriptionShopping.buy(stripePriceId)

			if (checkoutDetails)
				await stripePopups.checkoutSubscription(checkoutDetails)
		},

		async cancelSubscription(tierId: string) {
			state.subscriptions.mySubscriptionDetailsOp = ops.loading()
			await services.subscriptionShopping.cancelSubscription(tierId)
		},

		async uncancelSubscription(tierId: string) {
			state.subscriptions.mySubscriptionDetailsOp = ops.loading()
			await services.subscriptionShopping.uncancelSubscription(tierId)
		},
	}

	const reauthorizeAndRefreshAfter = <typeof actions>objectMap(
		actions,
		fun => async(...args: any[]) => {
			await fun(...args)
			await reauthorize()
		},
	)

	function getPlans() {
		return ops.value(unproxy(state.subscriptions.subscriptionPlansOp))
			?? []
	}

	return {
		load,

		...reauthorizeAndRefreshAfter,

		async addPlan(options: {
				planLabel: string
				tier: SubscriptionTierDraft
			}) {
			const newPlan = await services.subscriptionPlanning.addPlan(options)
			const oldPlans = getPlans()
			state.subscriptions.subscriptionPlansOp = ops.replaceValue(
				state.subscriptions.subscriptionPlansOp,
				[...oldPlans, newPlan],
			)
			return newPlan
		},

		async addTier(options: {
				label: string
				planId: string
				pricing: SubscriptionPricingDraft
			}) {
			const plans = getPlans()
			const tier = await services.subscriptionPlanning
				.addTier(options)
			const plan = plans.find(plan => plan.planId === options.planId)
			plan.tiers = [...plan.tiers, tier]
			state.subscriptions.subscriptionPlansOp = ops.ready(plans)
			return tier
		},

		async editPlan({planId, label, archived}: {
				planId: string
				label: string
				archived: boolean
			}) {
			await services.subscriptionPlanning.editPlan({planId, label, archived})
			const plans = getPlans()
			const plan = plans.find(plan => plan.planId === planId)
			plan.label = label
			plan.archived = archived
			state.subscriptions.subscriptionPlansOp = ops.ready(plans)
		},

		async editTier({
				planId,
				tierId,
				label,
				active,
				pricing
			}: {
				planId: string
				tierId: string
				label: string
				active: boolean
				pricing: SubscriptionPricingDraft
			}) {
			await services.subscriptionPlanning.editTier({
				tierId,
				active,
				label,
				pricing
			})
			const plans = getPlans()
			const plan = plans.find(plan => plan.planId === planId)
			const tier = plan.tiers.find(tier => tier.tierId === tierId)
			tier.active = active
			tier.label = label
			tier.pricing[0].price = pricing.price
			state.subscriptions.subscriptionPlansOp = ops.ready(plans)
		},
	}
}
