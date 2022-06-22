
import {setupStoreState} from "./setup-store-state.js"
import {StorePopups, StoreServices} from "../types.js"
import {makeBillingSubmodel} from "../submodels/billing-submodel.js"
import {makeConnectSubmodel} from "../submodels/connect-submodel.js"
import {makeSubscriptionsSubmodel} from "../submodels/subscriptions-submodel.js"

export function setupStoreSubmodels({
		services, popups, reauthorize, reloadStore, stateDetails
	}: {
		services: StoreServices
		popups: StorePopups
		reauthorize: () => Promise<void>
		reloadStore: () => Promise<void>
		stateDetails: ReturnType <typeof setupStoreState>
	}) {

	const {snap, allowance, isStoreActive, isUserLoggedIn} = stateDetails
	
	const subscriptions = makeSubscriptionsSubmodel({
		snap, isStoreActive, isUserLoggedIn, reauthorize, popups, services
	})

	const billing = makeBillingSubmodel({
		snap, allowance, isStoreActive, isUserLoggedIn, popups, services
	})

	const connect = makeConnectSubmodel({
		snap, allowance,
		popups, services,
		reloadStore,
	})

	return {subscriptions, billing, connect}
}
