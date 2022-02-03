
import {snapstate} from "@chasemoskal/snapstate"

import {Op, ops} from "../../../../framework/ops.js"
import {AccessPayload} from "../../../auth/types/auth-tokens.js"
import {StripeConnectDetails, StripeConnectStatus, SubscriptionPlan} from "../../types/store-concepts.js"

export function makeStoreState() {
	return snapstate({
		user: {
			accessOp: ops.none() as Op<AccessPayload>,
		},
		stripeConnect: {
			connectStatusOp: ops.none() as Op<StripeConnectStatus>,
			connectDetailsOp: ops.none() as Op<StripeConnectDetails>,
		},
		subscriptionPlanning: {
			subscriptionPlansOp: ops.none() as Op<SubscriptionPlan[]>,
		},
		billing: {
			paymentMethodOp: ops.none() as Op<any>,
		},
		subscriptions: {
			subscriptionsOp: ops.none() as Op<any>,
		},
	})
}
