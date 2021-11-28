
import {Op, ops} from "../../../../framework/ops.js"
import {AccessPayload} from "../../../auth/types/auth-tokens.js"
import {snapstate} from "../../../../toolbox/snapstate/snapstate.js"
import {StoreStatus} from "../../api/services/types/store-status.js"
import {SubscriptionPlan} from "../../api/services/types/subscription-plan.js"
import {StripeAccountDetails} from "../../api/services/types/stripe-account-details.js"

export function makeStoreState() {
	return snapstate({

		accessOp:
			<Op<AccessPayload>>
				ops.none(),

		statusOp:
			<Op<StoreStatus>>
				ops.none(),

		stripeAccountDetailsOp:
			<Op<StripeAccountDetails>>
				ops.none(),

		subscriptionPlansOp:
			<Op<SubscriptionPlan[]>>
				ops.none(),

		subscriptionPlanCreationOp:
			<Op<undefined>>
				ops.none(),
	})
}
