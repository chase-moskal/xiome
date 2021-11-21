
import {XiomeVideoViews} from "./video-views/xiome-video-views.js"
import {XiomeVideoHosting} from "./video-hosting/xiome-video-hosting.js"
import {XiomeVideoDisplay} from "./video-display/xiome-video-display.js"
import {XiomeVideoCompanion} from "./video-companion/xiome-video-companion.js"
import {mixinSnapstateSubscriptions, mixinShare} from "../../../framework/component.js"
import {XiomeComponentOptions} from "../../../assembly/frontend/components/types/xiome-component-options.js"

export function integrateVideoComponents({models}: XiomeComponentOptions) {
	const {dacastModel, contentModel} = models.videoModels
	return {
		XiomeVideoHosting: (
			mixinSnapstateSubscriptions(dacastModel.subscribe)(
				mixinShare({
					dacastModel,
				})(XiomeVideoHosting)
			)
		),
		XiomeVideoDisplay: (
			mixinSnapstateSubscriptions(contentModel.subscribe)(
				mixinShare({
					contentModel,
				})(XiomeVideoDisplay)
			)
		),
		XiomeVideoViews: (
			mixinSnapstateSubscriptions(contentModel.subscribe)(
				mixinShare({
					contentModel,
				})(XiomeVideoViews)
			)
		),
		XiomeVideoCompanion: (
			mixinSnapstateSubscriptions(contentModel.subscribe)(
				mixinShare({
					contentModel,
				})(XiomeVideoCompanion)
			)
		),
	}
}
