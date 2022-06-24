
import {snapstate} from "@chasemoskal/snapstate"

import {Op, ops} from "../../../../framework/ops.js"
import {AccessPayload} from "../../../auth/types/auth-tokens.js"
import {PaymentMethod, StripeConnectDetails, StripeConnectStatus, SubscriptionDetails, SubscriptionPlan} from "../../types/store-concepts.js"

export function makeStoreState() {
	return snapstate({
		user: {
			accessOp: ops.none() as Op<AccessPayload>,
		},
		stripeConnect: {
			connectStatusOp: ops.none() as Op<StripeConnectStatus>,
			connectDetailsOp: ops.none() as Op<StripeConnectDetails>,
		},
		subscriptions: {
			subscriptionPlansOp: ops.none() as Op<SubscriptionPlan[]>,
			mySubscriptionDetailsOp: ops.none() as Op<SubscriptionDetails>,
		},
		billing: {
			paymentMethodOp: ops.none() as Op<undefined | PaymentMethod>,
		},
	})
}
