
import {StoreState} from "../types/store-state.js"
import {Op, ops} from "../../../../../framework/ops.js"
import {StoreStatus} from "../../../topics/types/store-status.js"
import {mobbdeep} from "../../../../../toolbox/mobbdeep/mobbdeep.js"
import {AccessPayload} from "../../../../auth/types/tokens/access-payload.js"
import {PlanningSituation} from "../shares/subscription-planning/types/planning-situation2.js"

export function storeCore() {
	const mobb = mobbdeep()

	const state: StoreState = mobb.observables({
		access: undefined,
		status: ops.loading(),
		subscriptionPlanning: {mode: PlanningSituation.Mode.LoggedOut},
		permissions: {
			canWriteSubscriptionPlans: false,
		},
	})

	const actions = mobb.actions({
		setAccess(access: AccessPayload) {
			state.access = access
		},
		setStatus(status: Op<StoreStatus>) {
			console.log("SET STATUS", ...ops.debug(status))
			state.status = status
		},
		setSubscriptionPlanningSituation(situation: PlanningSituation.Any) {
			state.subscriptionPlanning = situation
		},
	})

	return {state, actions, watch: mobb.watch}
}
