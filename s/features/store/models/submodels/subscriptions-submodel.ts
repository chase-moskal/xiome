
import {ops} from "../../../../framework/ops.js"
import {Service} from "../../../../types/service.js"
import {makeStoreState} from "../state/make-store-state.js"
import {makeStoreAllowance} from "../utils/make-store-allowance.js"
import {makeSubscriptionPlanningService} from "../../api/services/subscription-planning-service.js"
import {makeSubscriptionShoppingService} from "../../api/services/subscription-shopping-service.js"

export function makeSubscriptionsSubmodel({
		snap,
		allowance,
		subscriptionPlanningService,
		subscriptionShoppingService,
		initializeConnectSubmodel,
	}: {
		snap: ReturnType<typeof makeStoreState>
		allowance: ReturnType<typeof makeStoreAllowance>
		subscriptionPlanningService: Service<typeof makeSubscriptionPlanningService>
		subscriptionShoppingService: Service<typeof makeSubscriptionShoppingService>
		initializeConnectSubmodel: () => Promise<void>
	}) {

	const {state} = snap

	async function loadSubscriptionPlans() {
		await ops.operation({
			setOp: op => state.subscriptions.subscriptionPlansOp = op,
			promise: subscriptionShoppingService.listSubscriptionPlans(),
		})
	}

	async function initialize() {
		await initializeConnectSubmodel()
		if (ops.isNone(snap.state.subscriptions.subscriptionPlansOp))
			await loadSubscriptionPlans()
	}

	async function refresh() {
		if (!ops.isNone(snap.state.subscriptions.subscriptionPlansOp))
			await loadSubscriptionPlans()
	}

	return {
		initialize,
		refresh,

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
	}
}
