
import {ops} from "../../../../framework/ops.js"

import {StripePopups} from "../../popups/types.js"
import {StoreServices} from "../types.js"
import {StoreStateSystem} from "../state.js"

export function makeBillingSubmodel({
		stripePopups,
		services,
		stateSystem,
		reloadStore,
	}: {
		stripePopups: StripePopups
		services: StoreServices
		stateSystem: StoreStateSystem
		reloadStore: () => Promise<void>
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
		const {popupId, stripeAccountId, stripeSessionId, stripeSessionUrl} =
			await services.billing.checkoutPaymentMethod()

		await stripePopups.checkoutPaymentMethod({
			popupId,
			stripeAccountId,
			stripeSessionId,
			stripeSessionUrl,
		})

		await load()
	}

	async function disconnectPaymentMethod() {
		return ops.operation({
			promise: services.billing.disconnectPaymentMethod(),
			setOp: op => state.billing.paymentMethodOp = ops.replaceValue(op, undefined),
		})
	}

	async function customerPortal() {
		const {popupId, customerPortalLink} =
			await services.billing.generateCustomerPortalLink()
		await stripePopups.openStoreCustomerPortal(popupId, customerPortalLink)
		await reloadStore()
	}

	return {
		load,

		allowance,
		customerPortal,
		checkoutPaymentMethod,
		disconnectPaymentMethod,
	}
}
