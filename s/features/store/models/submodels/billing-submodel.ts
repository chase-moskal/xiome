
import {ops} from "../../../../framework/ops.js"
import {Service} from "../../../../types/service.js"
import {makeStoreState} from "../state/store-state.js"
import {TriggerCheckoutPopup} from "../../types/store-popups.js"
import {makeStoreAllowance} from "../utils/make-store-allowance.js"
import {makeBillingService} from "../../api/services/billing-service.js"

export function makeBillingSubmodel({
		snap, allowance, billingService,
		isStoreActive, isUserLoggedIn,
		triggerCheckoutPaymentMethodPopup,
	}: {
		snap: ReturnType<typeof makeStoreState>
		allowance: ReturnType<typeof makeStoreAllowance>
		billingService: Service<typeof makeBillingService>
		isStoreActive: () => boolean
		isUserLoggedIn: () => boolean
		triggerCheckoutPaymentMethodPopup: TriggerCheckoutPopup
	}) {

	async function load() {
		snap.state.billing.paymentMethodOp = ops.none()
		if (isStoreActive() && isUserLoggedIn()) {
			await ops.operation({
				promise: billingService.getPaymentMethodDetails(),
				setOp: op => snap.state.billing.paymentMethodOp = op,
			})
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
		await load()
	}

	async function disconnectPaymentMethod() {
		return ops.operation({
			promise: billingService.disconnectPaymentMethod(),
			setOp: op => snap.state.billing.paymentMethodOp = ops.replaceValue(op, undefined),
		})
	}

	return {
		load,

		allowance,
		checkoutPaymentMethod,
		disconnectPaymentMethod,
	}
}
