
import {XiomeBilling} from "./billing/xiome-billing.js"
import {XiomeStoreConnect} from "./store-connect/xiome-store-connect.js"
import {XiomeSubscriptions} from "./subscriptions/xiome-subscriptions.js"
import {mixinSnapstateSubscriptions, mixinShare} from "../../../framework/component.js"
import { XiomeStoreCustomerPortal } from "./customer-portal/xiome-store-customer-portal.js"
import {XiomeSubscriptionPlanning} from "./subscription-planning/xiome-subscription-planning.js"
import {XiomeComponentOptions} from "../../../assembly/frontend/components/types/xiome-component-options.js"

export function integrateStoreComponents({models, modals}: XiomeComponentOptions) {
	const {storeModel} = models
	return {
		XiomeStoreConnect: (
			mixinSnapstateSubscriptions(storeModel.snap.subscribe)(
				mixinShare({
					modals,
					storeModel,
				})(XiomeStoreConnect)
			)
		),
		XiomeSubscriptionPlanning: (
			mixinSnapstateSubscriptions(storeModel.snap.subscribe)(
				mixinShare({
					modals,
					storeModel,
				})(XiomeSubscriptionPlanning)
			)
		),
		XiomeBilling: (
			mixinSnapstateSubscriptions(storeModel.snap.subscribe)(
				mixinShare({
					modals,
					storeModel,
				})(XiomeBilling)
			)
		),
		XiomeSubscriptions: (
			mixinSnapstateSubscriptions(storeModel.snap.subscribe)(
				mixinShare({
					modals,
					storeModel,
				})(XiomeSubscriptions)
			)
		),
	XiomeStoreCustomerPortal: (
		mixinSnapstateSubscriptions(storeModel.snap.subscribe)(
			mixinShare({
				storeModel
			})(XiomeStoreCustomerPortal)
		)
	),
	}
}
