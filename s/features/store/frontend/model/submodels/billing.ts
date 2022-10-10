
import {ops} from "../../../../../framework/ops.js"

import {StoreServices} from "../../types.js"
import {StoreStateSystem} from "../../state.js"
import {StripePopups} from "../../../popups/types.js"

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
				promise: services.billing.getDefaultPaymentMethod(),
				setOp: op => state.billing.paymentMethodOp = op,
			})
		}
	}

	async function customerPortal() {
		const {popupId, customerPortalLink} = await services
			.billing
			.generateCustomerPortalLink()

		await stripePopups
			.openStoreCustomerPortal(popupId, customerPortalLink)

		await reloadStore()
	}

	return {
		load,
		allowance,
		customerPortal,
	}
}
