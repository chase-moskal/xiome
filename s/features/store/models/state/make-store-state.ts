
import {Op, ops} from "../../../../framework/ops.js"
import {AccessPayload} from "../../../auth/types/auth-tokens.js"
import {composeSnapstate, snapstate} from "../../../../toolbox/snapstate/snapstate.js"
import {StripeConnectDetails, StripeConnectStatus, SubscriptionPlan} from "../../types/store-concepts.js"

export function makeStoreState() {
	return composeSnapstate({
		user: snapstate({
			accessOp: ops.none() as Op<AccessPayload>,
		}),
		stripeConnect: snapstate({
			connectStatusOp: ops.none() as Op<StripeConnectStatus>,
			connectDetailsOp: ops.none() as Op<StripeConnectDetails>,
		}),
		subscriptionPlanning: snapstate({
			subscriptionPlansOp: ops.none() as Op<SubscriptionPlan[]>,
		}),
		billing: snapstate({
			paymentMethodOp: ops.none() as Op<any>,
		}),
		subscriptions: snapstate({
			subscriptionsOp: ops.none() as Op<any>,
		}),
	})
}
