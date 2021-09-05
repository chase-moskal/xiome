
import {XiomeLivestream} from "./xiome-livestream/xiome-livestream.js"
import {mixinMadstateSubscriptions, mixinShare} from "../../../framework/component/component.js"
import {XiomeComponentOptions} from "../../../assembly/frontend/components/types/xiome-component-options.js"

export function integrateLivestreamComponents({models, modals}: XiomeComponentOptions) {
	const {livestreamModel} = models
	return {
		XiomeLivestream: (
			mixinMadstateSubscriptions(livestreamModel.subscribe)(
				mixinShare({modals, livestreamModel})(XiomeLivestream)
			)
		),
	}
}
