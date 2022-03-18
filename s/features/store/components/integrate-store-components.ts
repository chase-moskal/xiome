
import {XiomeStoreConnect} from "./store-connect/xiome-store-connect.js"
import {mixinSnapstateSubscriptions, mixinShare} from "../../../framework/component.js"
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
	}
}
