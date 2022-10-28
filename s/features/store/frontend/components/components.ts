
import {mixinSnapstateSubscriptions, mixinShare} from "../../../../framework/component.js"
import {XiomeComponentOptions} from "../../../../assembly/frontend/components/types/xiome-component-options.js"

import {XiomeStoreConnect} from "./connect/component.js"
import {XiomeStoreBillingArea} from "./billing-area/component.js"
import {XiomeStoreCustomerPortal} from "./customer-portal/component.js"
import {XiomeStoreSubscriptionTier} from "./subscription-tier/component.js"
import {XiomeStoreSubscriptionStatus} from "./subscription-status/component.js"
import {XiomeStoreSubscriptionCatalog} from "./subscription-catalog/component.js"
import {XiomeStoreSubscriptionPlanning} from "./subscription-planning/component.js"

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
		XiomeStoreSubscriptionTier,
		XiomeStoreSubscriptionCatalog: XiomeStoreSubscriptionCatalog({
			modals,
			storeModel,
		}),
		XiomeStoreCustomerPortal: (
			mixinSnapstateSubscriptions(storeModel.snap.subscribe)(
				mixinShare({
					storeModel,
				})(XiomeStoreCustomerPortal)
			)
		),
		XiomeStoreSubscriptionStatus: XiomeStoreSubscriptionStatus({
			storeModel,
		}),
		XiomeStoreBillingArea: (
			mixinSnapstateSubscriptions(storeModel.snap.subscribe)(
				mixinShare({
					storeModel,
				})(XiomeStoreBillingArea)
			)
		),
	}
}
