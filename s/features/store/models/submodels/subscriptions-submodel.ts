
import {ops} from "../../../../framework/ops.js"
import {Service} from "../../../../types/service.js"
import {makeStoreState} from "../state/make-store-state.js"
import {objectMap} from "../../../../toolbox/object-map.js"
import {TriggerCheckoutPopup} from "../../types/store-popups.js"
import {makeStoreAllowance} from "../utils/make-store-allowance.js"
import {makeSubscriptionPlanningService} from "../../api/services/subscription-planning-service.js"
import {makeSubscriptionShoppingService} from "../../api/services/subscription-shopping-service.js"

export function makeSubscriptionsSubmodel({
		snap,
		allowance,
		subscriptionPlanningService,
		subscriptionShoppingService,
		reauthorize,
		initializeConnectSubmodel,
		triggerCheckoutSubscriptionPopup,
	}: {
		snap: ReturnType<typeof makeStoreState>
		allowance: ReturnType<typeof makeStoreAllowance>
		subscriptionPlanningService: Service<typeof makeSubscriptionPlanningService>
		subscriptionShoppingService: Service<typeof makeSubscriptionShoppingService>
		reauthorize: () => Promise<void>
		initializeConnectSubmodel: () => Promise<void>
		triggerCheckoutSubscriptionPopup: TriggerCheckoutPopup
	}) {

	const {state} = snap

	async function loadSubscriptionPlans() {
		await ops.operation({
			setOp: op => state.subscriptions.subscriptionPlansOp = op,
			promise: subscriptionShoppingService.listSubscriptionPlans(),
		})
	}

	async function loadMySubscriptionStatus() {
		await ops.operation({
			setOp: op => state.subscriptions.subscriptionDetails = op,
			promise: subscriptionShoppingService.fetchMySubscriptionStatus(),
		})
	}

	async function initialize() {
		await initializeConnectSubmodel()
		if (ops.isNone(snap.state.subscriptions.subscriptionPlansOp)) {
			await loadSubscriptionPlans()
			await loadMySubscriptionStatus()
		}
	}

	async function refresh() {
		if (!ops.isNone(snap.state.subscriptions.subscriptionPlansOp)) {
			await loadSubscriptionPlans()
			await loadMySubscriptionStatus()
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
		state.subscriptions.subscriptionDetails = ops.loading()
		await fun(...args)
		await reauthorize()
		await refresh()
	})

	return {
		initialize,
		refresh,

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
			const plans = ops.value(state.subscriptions.subscriptionPlansOp) ?? []
			const plan = plans.find(plan => plan.planId === options.planId)
			plan.tiers = [...plan.tiers, tier]
			return tier
		},
	}
}
