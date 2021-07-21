
import {Op} from "../../../../framework/ops.js"
import {AccessPayload} from "../../../auth/types/auth-tokens.js"
import {StoreStatus} from "../../api/services/types/store-status.js"
import {PlanningSituation} from "../shares/types/planning-situation.js"

export interface StoreState {
	access: AccessPayload
	status: Op<StoreStatus>
	subscriptionPlanning: PlanningSituation.Any
	permissions: {
		canWriteSubscriptionPlans: boolean
	}
}
