
import {ops} from "../../../../framework/ops.js"
import {StorePopups, StoreServices} from "../types.js"
import {makeStoreState} from "../state/store-state.js"
import {makeStoreAllowance} from "../utils/make-store-allowance.js"

export function makeBillingSubmodel({
		snap, allowance, services,popups,
		isStoreActive, isUserLoggedIn,
	}: {
		snap: ReturnType<typeof makeStoreState>
		allowance: ReturnType<typeof makeStoreAllowance>
		services: StoreServices
		popups: StorePopups
		isStoreActive: () => boolean
		isUserLoggedIn: () => boolean
	}) {

	async function load() {
		snap.state.billing.paymentMethodOp = ops.none()
		if (isStoreActive() && isUserLoggedIn()) {
			await ops.operation({
				promise: services.billing.getPaymentMethodDetails(),
				setOp: op => snap.state.billing.paymentMethodOp = op,
			})
		}
	}

	async function checkoutPaymentMethod() {
		const {stripeAccountId, stripeSessionId, stripeSessionUrl} =
			await services.billing.checkoutPaymentMethod()
		await popups.checkoutPaymentMethod({
			stripeAccountId,
			stripeSessionId,
			stripeSessionUrl,
		})
		await load()
	}

	async function disconnectPaymentMethod() {
		return ops.operation({
			promise: services.billing.disconnectPaymentMethod(),
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
