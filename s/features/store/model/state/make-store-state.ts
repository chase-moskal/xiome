
import {Op, ops} from "../../../../framework/ops.js"
import {AccessPayload} from "../../../auth/types/auth-tokens.js"
import {snapstate} from "../../../../toolbox/snapstate/snapstate.js"
import {StoreStatus} from "../../api/services/types/store-status.js"
import {PlanningSituation} from "../shares/types/planning-situation.js"

export function makeStoreState() {
	return snapstate({

		accessOp:
			<Op<AccessPayload>>
				ops.none(),

		statusOp:
			<Op<StoreStatus>>
				ops.none(),

		subscriptionPlanning:
			<PlanningSituation.Any>
				{mode: PlanningSituation.Mode.LoggedOut},
	})
}
