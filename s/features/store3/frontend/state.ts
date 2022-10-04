
import {snapstate} from "@chasemoskal/snapstate"

import {Op, ops} from "../../../framework/ops.js"
import {storePrivileges} from "../isomorphic/privileges.js"
import {AccessPayload} from "../../auth/types/auth-tokens.js"
import {StripeConnectStatus, StripeConnectDetails, SubscriptionPlan, SubscriptionDetails, PaymentMethod} from "../isomorphic/concepts.js"

export type StoreStateSystem = ReturnType<typeof makeStoreStateSystem>
export type StoreSnap = StoreStateSystem["snap"]
export type StoreAllowance = StoreStateSystem["allowance"]
export type StoreState = StoreSnap["state"]

export function makeStoreStateSystem() {
	const snap = snapstate({
		user: {
			accessOp: ops.none() as Op<AccessPayload>,
		},
		stripeConnect: {
			connectStatusOp: ops.none() as Op<StripeConnectStatus>,
			connectDetailsOp: ops.none() as Op<StripeConnectDetails>,
		},
		subscriptions: {
			subscriptionPlansOp: ops.none() as Op<SubscriptionPlan[]>,
			mySubscriptionDetailsOp: ops.none() as Op<SubscriptionDetails[]>,
		},
		billing: {
			paymentMethodOp: ops.none() as Op<undefined | PaymentMethod>,
		},
	})

	const state = snap.readable

	const allowance = (() => {
		const has = (key: keyof typeof storePrivileges) => {
			const privileges =
				ops.value(state.user.accessOp)
					?.permit.privileges
						?? []
			return privileges.includes(storePrivileges[key])
		}
		return {
			get manageStore() { return has("manage store") },
			get connectStripeAccount() { return has("control stripe account") },
			get giveAwayFreebies() { return has("give away freebies") },
		}
	})()

	return {
		snap,
		state,
		allowance,
		get: {
			is: {
				get storeActive() {
					return ops.value(snap.state.stripeConnect.connectStatusOp)
						=== StripeConnectStatus.Ready
				},
				get userLoggedIn() {
					return !!ops.value(snap.state.user.accessOp)?.user
				},
			},
			user: {
				get access() { return ops.value(state.user.accessOp) },
			},
			connect: {
				get status() { return ops.value(state.stripeConnect.connectStatusOp) },
				get details() { return ops.value(state.stripeConnect.connectDetailsOp) },
			},
			subscriptions: {
				get plans() { return ops.value(state.subscriptions.subscriptionPlansOp) },
				get mySubscriptionDetails() { return ops.value(state.subscriptions.mySubscriptionDetailsOp) },
			},
			billing: {
				get paymentMethod() { return ops.value(state.billing.paymentMethodOp) },
			}
		},
	}
}
