
import {mixinSnapstateSubscriptions, mixinShare} from "../../../../framework/component.js"
import {XiomeComponentOptions} from "../../../../assembly/frontend/components/types/xiome-component-options.js"

import {XiomeStoreConnect} from "./connect/component.js"
import {XiomeSubscriptions} from "./subscriptions/component.js"
import {XiomeStoreCustomerPortal} from "./customer-portal/component.js"
import {XiomeSubscriptionPlanning} from "./subscription-planning/component.js"

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
					storeModel,
				})(XiomeStoreCustomerPortal)
			)
		),
	}
}
