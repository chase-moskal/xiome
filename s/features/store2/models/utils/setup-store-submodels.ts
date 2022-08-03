
import {StoreServices} from "../types.js"
import {StripePopups} from "../../popups/types.js"
import {StoreStateSystem} from "../state/store-state-system.js"
import {makeBillingSubmodel} from "../submodels/billing-submodel.js"
import {makeConnectSubmodel} from "../submodels/connect-submodel.js"
import {makeSubscriptionsSubmodel} from "../submodels/subscriptions-submodel.js"

export function setupStoreSubmodels(options: {
		services: StoreServices
		stateSystem: StoreStateSystem
		stripePopups: StripePopups
		reauthorize: () => Promise<void>
		reloadStore: () => Promise<void>
	}) {

	const subscriptions = makeSubscriptionsSubmodel(options)
	const billing = makeBillingSubmodel(options)
	const connect = makeConnectSubmodel(options)

	return {subscriptions, billing, connect}
}
