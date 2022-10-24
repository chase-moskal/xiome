
import {mixinSnapstateSubscriptions, mixinShare} from "../../../../framework/component.js"
import {XiomeComponentOptions} from "../../../../assembly/frontend/components/types/xiome-component-options.js"

import {XiomeStoreConnect} from "./connect/component.js"
import {XiomeStoreBillingArea} from "./billing-area/component.js"
import {XiomeStoreCustomerPortal} from "./customer-portal/component.js"
import {XiomeStoreSubscriptionStatus} from "./subscription-status/component.js"
import {XiomeStoreSubscriptionCatalog} from "./subscription-catalog/component.js"
import {XiomeStoreSubscriptionPlanning} from "./subscription-planning/component.js"
import {XiomeStoreSubscriptionCatalogTwo} from "./subscription-catalog/component2.js"

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
		XiomeStoreSubscriptionPlanning: (
			mixinSnapstateSubscriptions(storeModel.snap.subscribe)(
				mixinShare({
					modals,
					storeModel,
				})(XiomeStoreSubscriptionPlanning)
			)
		),
		XiomeStoreSubscriptionCatalog: (
			mixinSnapstateSubscriptions(storeModel.snap.subscribe)(
				mixinShare({
					modals,
					storeModel,
				})(XiomeStoreSubscriptionCatalog)
			)
		),
		XiomeStoreSubscriptionCatalogTwo: (
			mixinSnapstateSubscriptions(storeModel.snap.subscribe)(
				mixinShare({
					modals,
					storeModel,
				})(XiomeStoreSubscriptionCatalogTwo)
			)
		),
		XiomeStoreCustomerPortal: (
			mixinSnapstateSubscriptions(storeModel.snap.subscribe)(
				mixinShare({
					storeModel,
				})(XiomeStoreCustomerPortal)
			)
		),
		XiomeStoreSubscriptionStatus: (
			mixinSnapstateSubscriptions(storeModel.snap.subscribe)(
				mixinShare({
					storeModel,
				})(XiomeStoreSubscriptionStatus)
			)
		),
		XiomeStoreBillingArea: (
			mixinSnapstateSubscriptions(storeModel.snap.subscribe)(
				mixinShare({
					storeModel,
				})(XiomeStoreBillingArea)
			)
		),
	}
}
