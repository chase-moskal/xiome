
import {ops} from "../../../../framework/ops.js"
import {Service} from "../../../../types/service.js"
import {makeActivator} from "../utils/make-activator.js"
import {makeStoreState} from "../state/make-store-state.js"
import {makeStoreAllowance} from "../utils/make-store-allowance.js"
import {StoreStatus} from "../../api/services/types/store-status.js"
import {makeShopkeepingService} from "../../api/services/shopkeeping-service.js"
import {SubscriptionPlanDraft} from "../../api/types/drafts/subscription-plan-draft.js"

export function makeSubscriptionPlanningSubmodel({
		state,
		allowance,
		shopkeepingService,
	}: {
		state: ReturnType<typeof makeStoreState>
		allowance: ReturnType<typeof makeStoreAllowance>
		shopkeepingService: Service<typeof makeShopkeepingService>
	}) {

	function isPlanningAllowed() {
		const status = ops.value(state.readable.statusOp)
		return status === StoreStatus.Enabled
			? allowance.manageStore
				? true
				: false
			: false
	}

	async function loadPlans() {
		if (isPlanningAllowed())
			await ops.operation({
				promise: shopkeepingService.listSubscriptionPlans(),
				errorReason: "failed to load subscription plans",
				setOp: op => state.writable.subscriptionPlansOp = op,
			})
		else
			state.writable.subscriptionPlansOp = ops.ready([])
	}

	const activator = makeActivator(loadPlans)

	async function createPlan(draft: SubscriptionPlanDraft) {
		return ops.operation({
			promise: (async() => {
				const plan = await shopkeepingService.createSubscriptionPlan({draft})
				const existingPlans = ops.value(state.readable.subscriptionPlansOp)
				state.writable.subscriptionPlansOp
					= ops.ready([...existingPlans, plan])
				return plan
			})(),
			setOp: op => state.writable.subscriptionPlanCreationOp =
				ops.replaceValue(op, undefined),
		})
	}

	async function listAfterwards(action: () => Promise<void>) {
		return ops.operation({
			promise: action()
				.then(shopkeepingService.listSubscriptionPlans),
			setOp: op => state.writable.subscriptionPlansOp = op,
		})
	}

	async function deactivatePlan(subscriptionPlanId: string) {
		return listAfterwards(() =>
			shopkeepingService.deactivateSubscriptionPlan({subscriptionPlanId}))
	}

	async function deletePlan(subscriptionPlanId: string) {
		return listAfterwards(() =>
			shopkeepingService.deleteSubscriptionPlan({subscriptionPlanId}))
	}

	return {
		activate: activator.activate,
		refresh: activator.refreshIfActivated,
		get planningAllowed() {
			return isPlanningAllowed()
		},
		createPlan,
		deactivatePlan,
		deletePlan,
	}
}
