
import {unproxy} from "@chasemoskal/snapstate"

import {ops} from "../../../../framework/ops.js"
import {Service} from "../../../../types/service.js"
import {makeStoreState} from "../state/store-state.js"
import {objectMap} from "../../../../toolbox/object-map.js"
import {TriggerCheckoutPopup} from "../../types/store-popups.js"
import {makeStoreAllowance} from "../utils/make-store-allowance.js"
import {makeSubscriptionPlanningService} from "../../api/services/subscription-planning-service.js"
import {makeSubscriptionShoppingService} from "../../api/services/subscription-shopping-service.js"
import {makeSubscriptionObserverService} from "../../api/services/subscription-observer-service.js"

export function makeSubscriptionsSubmodel({
		snap,
		allowance,
		subscriptionPlanningService,
		subscriptionShoppingService,
		subscriptionObserverService,
		isStoreActive,
		isUserLoggedIn,
		reauthorize,
		triggerCheckoutSubscriptionPopup,
	}: {
		snap: ReturnType<typeof makeStoreState>
		allowance: ReturnType<typeof makeStoreAllowance>
		subscriptionPlanningService: Service<typeof makeSubscriptionPlanningService>
		subscriptionShoppingService: Service<typeof makeSubscriptionShoppingService>
		subscriptionObserverService: Service<typeof makeSubscriptionObserverService>
		isStoreActive: () => boolean
		isUserLoggedIn: () => boolean
		reauthorize: () => Promise<void>
		triggerCheckoutSubscriptionPopup: TriggerCheckoutPopup
	}) {

	const {state} = snap

	async function load() {
		state.subscriptions.subscriptionPlansOp = ops.none()
		state.subscriptions.subscriptionDetailsOp = ops.none()
		if (isStoreActive()) {
			await ops.operation({
				setOp: op => state.subscriptions.subscriptionPlansOp = op,
				promise: subscriptionObserverService.listSubscriptionPlans(),
			})
			if (isUserLoggedIn()) {
				await ops.operation({
					setOp: op => state.subscriptions.subscriptionDetailsOp = op,
					promise: subscriptionShoppingService.fetchMySubscriptionStatus(),
				})
			}
		}
	}

	const actions = {
		async checkoutSubscriptionTier(tierId: string) {
			await triggerCheckoutSubscriptionPopup(
				await subscriptionShoppingService.checkoutSubscriptionTier(tierId)
			)
		},

		async createNewSubscriptionForTier(tierId: string) {
			await subscriptionShoppingService.createNewSubscriptionForTier(tierId)
		},

		async updateExistingSubscriptionWithNewTier(tierId: string) {
			await subscriptionShoppingService.updateSubscriptionTier(tierId)
		},

		async unsubscribeFromTier(tierId: string) {
			await subscriptionShoppingService.unsubscribeFromTier(tierId)
		},

		async cancelSubscription() {
			await subscriptionShoppingService.cancelSubscription()
		},

		async uncancelSubscription() {
			await subscriptionShoppingService.uncancelSubscription()
		},
	}

	const reauthorizeAndRefreshAfter = <typeof actions>objectMap(actions, fun => async(...args: any[]) => {
		state.subscriptions.subscriptionDetailsOp = ops.loading()
		await fun(...args)
		await reauthorize()
	})

	return {
		load,

		...reauthorizeAndRefreshAfter,

		async addPlan(options: {
				planLabel: string
				tierLabel: string
				tierPrice: number
			}) {
			const newPlan = await subscriptionPlanningService.addPlan(options)
			const oldPlans = ops.value(state.subscriptions.subscriptionPlansOp) ?? []
			state.subscriptions.subscriptionPlansOp = ops.replaceValue(
				state.subscriptions.subscriptionPlansOp,
				[...oldPlans, newPlan],
			)
			return newPlan
		},

		async addTier(options: {
				label: string
				price: number
				planId: string
				currency: "usd"
				interval: "month" | "year"
			}) {
			const tier = await subscriptionPlanningService
				.addTier(options)
			const plans = ops.value(unproxy(state.subscriptions.subscriptionPlansOp)) ?? []
			const plan = plans.find(plan => plan.planId === options.planId)
			plan.tiers = [...plan.tiers, tier]
			state.subscriptions.subscriptionPlansOp = ops.ready(plans)
			return tier
		},
	}
}
