
import {restricted} from "@chasemoskal/snapstate"

import {ops} from "../../../../framework/ops.js"
import {Service} from "../../../../types/service.js"
import {makeStoreState} from "../state/make-store-state.js"
import {TriggerCheckoutPopup} from "../../types/store-popups.js"
import {makeStoreAllowance} from "../utils/make-store-allowance.js"
import {makeBillingService} from "../../api/services/billing-service.js"

export function makeBillingSubmodel({
		snap, allowance, billingService, triggerCheckoutPaymentMethodPopup,
	}: {
		snap: ReturnType<typeof makeStoreState>
		allowance: ReturnType<typeof makeStoreAllowance>
		billingService: Service<typeof makeBillingService>
		triggerCheckoutPaymentMethodPopup: TriggerCheckoutPopup
	}) {

	async function loadPaymentMethodDetails() {
		return ops.operation({
			promise: billingService.getPaymentMethodDetails(),
			setOp: op => snap.state.billing.paymentMethodOp = op,
		})
	}

	async function initialize() {
		if (ops.isNone(snap.state.billing.paymentMethodOp)) {
			await loadPaymentMethodDetails()
		}
	}

	async function checkoutPaymentMethod() {
		const {stripeAccountId, stripeSessionId, stripeSessionUrl} =
			await billingService.checkoutPaymentMethod()
		await triggerCheckoutPaymentMethodPopup({
			stripeAccountId,
			stripeSessionId,
			stripeSessionUrl,
		})
		await loadPaymentMethodDetails()
	}

	async function disconnectPaymentMethod() {
		return ops.operation({
			promise: billingService.disconnectPaymentMethod(),
			setOp: op => snap.state.billing.paymentMethodOp = ops.replaceValue(op, undefined),
		})
	}

	return {
		allowance,
		state: snap.readable,
		snap: restricted(snap),
		initialize,
		loadPaymentMethodDetails,
		checkoutPaymentMethod,
		disconnectPaymentMethod,
	}
}
