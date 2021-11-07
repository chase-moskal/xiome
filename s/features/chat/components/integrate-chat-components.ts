
import {XiomeChat} from "./xiome-chat/xiome-chat.js"
import {mixinSnapstateSubscriptions, mixinShare} from "../../../framework/component.js"
import {XiomeComponentOptions} from "../../../assembly/frontend/components/types/xiome-component-options.js"

export function integrateChatComponents({models, modals}: XiomeComponentOptions) {
	const {chatModel} = models
	return {
		XiomeChat: (
			mixinSnapstateSubscriptions(chatModel.subscribe)(
				mixinShare({
					modals,
					chatModel,
				})(XiomeChat)
			)
		),
	}
}
