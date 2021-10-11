
import {XiomeLivestream} from "./xiome-livestream/xiome-livestream.js"
import {mixinSnapstateSubscriptions, mixinShare} from "../../../framework/component/component.js"
import {XiomeComponentOptions} from "../../../assembly/frontend/components/types/xiome-component-options.js"

export function integrateLivestreamComponents({models, modals}: XiomeComponentOptions) {
	const {livestreamModel} = models
	return {
		XiomeLivestream: (
			mixinSnapstateSubscriptions(livestreamModel.subscribe)(
				mixinShare({modals, livestreamModel})(XiomeLivestream)
			)
		),
	}
}
