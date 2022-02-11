
import {substate} from "@chasemoskal/snapstate"

import {ops} from "../../../../framework/ops.js"
import {Service} from "../../../../types/service.js"
import {makeActivator} from "../utils/make-activator.js"
import {makeStoreState} from "../state/make-store-state.js"
import {makeStoreAllowance} from "../utils/make-store-allowance.js"
import {makeSubscriptionPlanningService} from "../../api/services/subscription-planning-service.js"

export function makeSubscriptionPlanningSubmodel({
		snap,
		allowance,
		subscriptionPlanningService,
	}: {
		snap: ReturnType<typeof makeStoreState>
		allowance: ReturnType<typeof makeStoreAllowance>
		subscriptionPlanningService: Service<typeof makeSubscriptionPlanningService>
	}) {

	const planningSnap = substate(snap, tree => tree.subscriptionPlanning)

	async function loadSubscriptionPlans() {
		await ops.operation({
			setOp: op => planningSnap.writable.subscriptionPlansOp = op,
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
			const oldPlans = ops.value(planningSnap.readable.subscriptionPlansOp) ?? []
			planningSnap.writable.subscriptionPlansOp = ops.replaceValue(
				planningSnap.readable.subscriptionPlansOp,
				[...oldPlans, newPlan],
			)
			return newPlan
		},
	}
}
