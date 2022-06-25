
import {StorePopups, StoreServices} from "../types.js"
import {StoreStateSystem} from "../state/store-state-system.js"
import {makeBillingSubmodel} from "../submodels/billing-submodel.js"
import {makeConnectSubmodel} from "../submodels/connect-submodel.js"
import {makeSubscriptionsSubmodel} from "../submodels/subscriptions-submodel.js"

export function setupStoreSubmodels({
		services, popups, stateSystem, reauthorize, reloadStore,
	}: {
		popups: StorePopups
		services: StoreServices
		stateSystem: StoreStateSystem
		reauthorize: () => Promise<void>
		reloadStore: () => Promise<void>
	}) {
	
	const subscriptions = makeSubscriptionsSubmodel({
		stateSystem, reauthorize, popups, services,
	})

	const billing = makeBillingSubmodel({
		stateSystem, popups, services,
	})

	const connect = makeConnectSubmodel({
		stateSystem, popups, services, reloadStore,
	})

	return {subscriptions, billing, connect}
}
