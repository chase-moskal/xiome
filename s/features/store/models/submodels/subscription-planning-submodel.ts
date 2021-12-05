
import {ops} from "../../../../framework/ops.js"
import {Service} from "../../../../types/service.js"
import {makeSubscriptionPlanningService} from "../../api/services/subscription-planning-service.js"
import {makeStoreState} from "../state/make-store-state.js"
import {makeActivator} from "../utils/make-activator.js"
import {makeStoreAllowance} from "../utils/make-store-allowance.js"

export function makeSubscriptionPlanningSubmodel({
		state,
		allowance,
		subscriptionPlanningService,
	}: {
		state: ReturnType<typeof makeStoreState>
		allowance: ReturnType<typeof makeStoreAllowance>
		subscriptionPlanningService: Service<typeof makeSubscriptionPlanningService>
	}) {

	async function loadSubscriptionPlans() {
		await ops.operation({
			setOp: op => state.writable.subscriptionPlansOp = op,
			promise: subscriptionPlanningService.listSubscriptionPlans(),
		})
	}

	const activator = makeActivator(loadSubscriptionPlans)

	return {
		activate: activator.activate,
		refresh: activator.refreshIfActivated,

		async addPlan(options: {
				planLabel: string
				tierLabel: string
				tierPrice: number
			}) {
			const newPlan = await subscriptionPlanningService.addPlan(options)
			const oldPlans = ops.value(state.readable.subscriptionPlansOp) ?? []
			state.writable.subscriptionPlansOp = ops.replaceValue(
				state.readable.subscriptionPlansOp,
				[...oldPlans, newPlan],
			)
			return newPlan
		},
	}
}
