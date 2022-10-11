
import {mixinSnapstateSubscriptions, mixinShare} from "../../../../framework/component.js"
import {XiomeComponentOptions} from "../../../../assembly/frontend/components/types/xiome-component-options.js"

import {XiomeStoreConnect} from "./connect/component.js"
import {XiomeStoreCustomerPortal} from "./customer-portal/component.js"
import {XiomeStoreSubscriptionCatalog} from "./subscription-catalog/component.js"
import {XiomeStoreSubscriptionPlanning} from "./subscription-planning/component.js"
import {XiomeStoreSubscriptionControls} from "./subscription-controls/component.js"

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
		XiomeStoreCustomerPortal: (
			mixinSnapstateSubscriptions(storeModel.snap.subscribe)(
				mixinShare({
					storeModel,
				})(XiomeStoreCustomerPortal)
			)
		),
		XiomeStoreSubscriptionControls: (
			mixinSnapstateSubscriptions(storeModel.snap.subscribe)(
				mixinShare({
					storeModel,
				})(XiomeStoreSubscriptionControls)
			)
		),
	}
}
