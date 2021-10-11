
import {XiomeVideoHosting} from "./video-hosting/xiome-video-hosting.js"
import {XiomeVideoDisplay} from "./video-display/xiome-video-display.js"
import {mixinMadstateSubscriptions, mixinShare} from "../../../framework/component/component.js"
import {XiomeComponentOptions} from "../../../assembly/frontend/components/types/xiome-component-options.js"

export function integrateVideoComponents({models}: XiomeComponentOptions) {
	const {dacastModel, contentModel} = models.videoModels
	return {
		XiomeVideoHosting: (
			mixinMadstateSubscriptions(dacastModel.subscribe)(
				mixinShare({
					dacastModel,
				})(XiomeVideoHosting)
			)
		),
		XiomeVideoDisplay: (
			mixinMadstateSubscriptions(contentModel.subscribe)(
				mixinShare({
					contentModel,
				})(XiomeVideoDisplay)
			)
		),
	}
}
