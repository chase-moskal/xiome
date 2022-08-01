
import {unproxy} from "@chasemoskal/snapstate"

import {ops} from "../../../../framework/ops.js"
import {StorePopups, StoreServices} from "../types.js"
import {objectMap} from "../../../../toolbox/object-map.js"
import {StoreStateSystem} from "../state/store-state-system.js"
import {SubscriptionPricing} from "../../types/store-concepts.js"
import {popupCoordinator} from "../../popups/popup-coordinator.js"
import {SubscriptionTierDraft} from "../../api/services/planning/planning-types.js"

export function makeSubscriptionsSubmodel({
		popups,
		services,
		stateSystem,
		reauthorize,
	}: {
		popups: StorePopups
		services: StoreServices
		stateSystem: StoreStateSystem
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
		async checkoutSubscriptionTier(tierId: string) {
			const {
				stripeAccountId,
				stripeSessionId,
				stripeSessionUrl,
				popupInfo: {popupId},
			} = await services.subscriptionShopping.buySubscriptionViaCheckoutSession(tierId)
			const result = await popupCoordinator.openPopupAndWaitForResult({
				url: stripeSessionUrl,
				width: 260,
				height: 260,
				popupId,
			})
			console.log("RESULT", result)
			debugger
		},

		async createNewSubscriptionForTier(tierId: string) {
			await services.subscriptionShopping.buySubscriptionViaExistingPaymentMethod(tierId)
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
