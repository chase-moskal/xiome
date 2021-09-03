
import {XiomeComponentOptions} from "../types/xiome-component-options.js"
import {mixinHappy, mixinShare} from "../../../../framework/component/component.js"
import {XiomeLivestream} from "../../../../features/livestream/component/xiome-livestream.js"

export function xiomeLivestreamComponents({models, modals}: XiomeComponentOptions) {
	const {livestreamModel} = models
	return {
		XiomeLivestream: mixinHappy(livestreamModel.onStateChange)(
			mixinShare({modals, livestreamModel})(XiomeLivestream)
		),
	}
}
