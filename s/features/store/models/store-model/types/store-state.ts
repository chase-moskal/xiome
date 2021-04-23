
import {Op} from "../../../../../framework/ops.js"
import {StoreStatus} from "../../../topics/types/store-status.js"
import {AccessPayload} from "../../../../auth/types/tokens/access-payload.js"
import {PlanningSituation} from "../shares/types/planning-situation2.js"

export interface StoreState {
	access: AccessPayload
	status: Op<StoreStatus>
	subscriptionPlanning: PlanningSituation.Any
	permissions: {
		canWriteSubscriptionPlans: boolean
	}
}
