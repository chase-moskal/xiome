
import {ops} from "../../../../framework/ops.js"
import {makeStoreState} from "../state/store-state.js"
import {makeStoreAllowance} from "./make-store-allowance.js"
import {StripeConnectStatus} from "../../types/store-concepts.js"

export function setupStoreState() {

	const snap = makeStoreState()
	const allowance = makeStoreAllowance(snap)

	function isStoreActive() {
		return ops.value(snap.state.stripeConnect.connectStatusOp)
			=== StripeConnectStatus.Ready
	}

	function isUserLoggedIn() {
		return !!ops.value(snap.state.user.accessOp)?.user
	}

	return {snap, allowance, isStoreActive, isUserLoggedIn}
}
