
import {StoreServices} from "../types.js"
import {ops} from "../../../../framework/ops.js"
import {StripePopups} from "../../popups/types.js"
import {StoreStateSystem} from "../state/store-state-system.js"

export function makeBillingSubmodel({
		stripePopups,
		services,
		stateSystem,
	}: {
		stripePopups: StripePopups
		services: StoreServices
		stateSystem: StoreStateSystem
	}) {

	const state = stateSystem.snap.writable
	const {get, allowance} = stateSystem

	async function load() {
		state.billing.paymentMethodOp = ops.none()
		if (get.is.storeActive && get.is.userLoggedIn) {
			await ops.operation({
				promise: services.billing.getPaymentMethodDetails(),
				setOp: op => state.billing.paymentMethodOp = op,
			})
		}
	}

	async function checkoutPaymentMethod() {
		const {stripeAccountId, stripeSessionId, stripeSessionUrl} =
			await services.billing.checkoutPaymentMethod()

		// TODO billing popup
		console.log("TODO billing checkout payment method popup")
		// await popups.checkoutPaymentMethod({
		// 	stripeAccountId,
		// 	stripeSessionId,
		// 	stripeSessionUrl,
		// })

		await load()
	}

	async function disconnectPaymentMethod() {
		return ops.operation({
			promise: services.billing.disconnectPaymentMethod(),
			setOp: op => state.billing.paymentMethodOp = ops.replaceValue(op, undefined),
		})
	}

	return {
		load,

		allowance,
		checkoutPaymentMethod,
		disconnectPaymentMethod,
	}
}
