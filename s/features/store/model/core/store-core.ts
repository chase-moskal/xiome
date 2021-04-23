
import {StoreState} from "../types/store-state.js"
import {Op, ops} from "../../../../framework/ops.js"
import {StoreStatus} from "../../topics/types/store-status.js"
import {autowatcher} from "../../../../toolbox/autowatcher/autowatcher.js"
import {PlanningSituation} from "../shares/types/planning-situation.js"
import {AccessPayload} from "../../../auth/types/tokens/access-payload.js"

export function storeCore() {
	const watcher = autowatcher()

	const state: StoreState = watcher.observables({
		access: undefined,
		status: ops.loading(),
		subscriptionPlanning: {mode: PlanningSituation.Mode.LoggedOut},
		permissions: {
			canWriteSubscriptionPlans: false,
		},
	})

	const actions = watcher.actions({
		setAccess(access: AccessPayload) {
			state.access = access
		},
		setStatus(status: Op<StoreStatus>) {
			state.status = status
		},
		setSubscriptionPlanningSituation(situation: PlanningSituation.Any) {
			state.subscriptionPlanning = situation
		},
	})

	return {state, actions, watch: watcher.watch}
}
