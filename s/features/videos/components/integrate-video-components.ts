
import {XiomeVideoLink} from "./xiome-video-link/xiome-video-link.js"
import {mixinMadstateSubscriptions, mixinShare} from "../../../framework/component/component.js"
import {XiomeComponentOptions} from "../../../assembly/frontend/components/types/xiome-component-options.js"
import {XiomeVideoDisplay} from "./xiome-video-display/xiome-video-display.js"

export function integrateVideoComponents({models}: XiomeComponentOptions) {
	const {dacastModel, contentModel} = models.videoModels
	return {
		XiomeVideoLink: (
			mixinMadstateSubscriptions(dacastModel.subscribe)(
				mixinShare({
					dacastModel,
				})(XiomeVideoLink)
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
