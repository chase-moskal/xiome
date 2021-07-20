
import {Op} from "../../../../framework/ops.js"
import {StoreStatus} from "../../topics/types/store-status.js"
import {AccessPayload} from "../../../auth2/types/auth-tokens.js"
import {PlanningSituation} from "../shares/types/planning-situation.js"

export interface StoreState {
	access: AccessPayload
	status: Op<StoreStatus>
	subscriptionPlanning: PlanningSituation.Any
	permissions: {
		canWriteSubscriptionPlans: boolean
	}
}
