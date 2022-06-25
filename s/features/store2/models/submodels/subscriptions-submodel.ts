
import {unproxy} from "@chasemoskal/snapstate"

import {ops} from "../../../../framework/ops.js"
import {StorePopups, StoreServices} from "../types.js"
import {makeStoreState} from "../state/store-state.js"
import {objectMap} from "../../../../toolbox/object-map.js"
import {SubscriptionPricing} from "../../types/store-concepts.js"
import {SubscriptionTierDraft} from "../../api/services/planning/planning-types.js"

export function makeSubscriptionsSubmodel({
		snap,
		services,
		isStoreActive,
		isUserLoggedIn,
		reauthorize,
		popups,
	}: {
		snap: ReturnType<typeof makeStoreState>
		services: StoreServices
		isStoreActive: () => boolean
		isUserLoggedIn: () => boolean
		reauthorize: () => Promise<void>
		popups: StorePopups
	}) {

	const {state} = snap

	async function load() {
		state.subscriptions.subscriptionPlansOp = ops.none()
		state.subscriptions.mySubscriptionDetailsOp = ops.none()
		if (isStoreActive()) {
			await ops.operation({
				setOp: op => state.subscriptions.subscriptionPlansOp = op,
				promise: services.subscriptionObserver.listSubscriptionPlans(),
			})
			if (isUserLoggedIn()) {
				await ops.operation({
					setOp: op => state.subscriptions.mySubscriptionDetailsOp = op,
					promise: services.subscriptionShopping.fetchMySubscriptionDetails(),
				})
			}
		}
	}

	const actions = {
		async checkoutSubscriptionTier(tierId: string) {
			await popups.checkoutSubscription(
				await services.subscriptionShopping.checkoutSubscriptionTier(tierId)
			)
		},

		async createNewSubscriptionForTier(tierId: string) {
			await services.subscriptionShopping.createNewSubscriptionForTier(tierId)
		},

		async updateExistingSubscriptionWithNewTier(tierId: string) {
			await services.subscriptionShopping.updateSubscriptionTier(tierId)
		},

		async unsubscribeFromTier(tierId: string) {
			await services.subscriptionShopping.unsubscribeFromTier(tierId)
		},

		async cancelSubscription(tierId: string) {
			await services.subscriptionShopping.cancelSubscription(tierId)
		},

		async uncancelSubscription(tierId: string) {
			await services.subscriptionShopping.uncancelSubscription(tierId)
		},
	}

	const reauthorizeAndRefreshAfter = <typeof actions>objectMap(
		actions,
		fun => async(...args: any[]) => {
			state.subscriptions.mySubscriptionDetailsOp = ops.loading()
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
				pricing: SubscriptionPricing
			}) {
			const plans = getPlans()
			const tier = await services.subscriptionPlanning
				.addTier(options)
			const plan = plans.find(plan => plan.planId === options.planId)
			plan.tiers = [...plan.tiers, tier]
			state.subscriptions.subscriptionPlansOp = ops.ready(plans)
			return tier
		},

		async editPlan({planId, label, active}: {
				planId: string
				label: string
				active: boolean
			}) {
			await services.subscriptionPlanning.editPlan({planId, label})
			const plans = getPlans()
			const plan = plans.find(plan => plan.planId === planId)
			plan.label = label
			plan.active = active
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
				pricing: SubscriptionPricing
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
			state.subscriptions.subscriptionPlansOp = ops.ready(plans)
		},
	}
}
