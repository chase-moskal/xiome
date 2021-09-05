
import {XiomeComponentOptions} from "../types/xiome-component-options.js"
import {XiomeLivestream} from "../../../../features/livestream/components/xiome-livestream.js"
import {mixinMadstateSubscriptions, mixinShare} from "../../../../framework/component/component.js"

export function xiomeLivestreamComponents({models, modals}: XiomeComponentOptions) {
	const {livestreamModel} = models
	return {
		XiomeLivestream:
			mixinMadstateSubscriptions(livestreamModel.subscribe)(
				mixinShare({modals, livestreamModel})(XiomeLivestream)
			),
	}
}
