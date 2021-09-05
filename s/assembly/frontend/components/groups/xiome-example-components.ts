
import {XiomeComponentOptions} from "../types/xiome-component-options.js"
import {XiomeExample} from "../../../../features/example/components/xiome-example.js"
import {mixinMadstateSubscriptions, mixinShare} from "../../../../framework/component/component.js"

export function xiomeExampleComponents({models, modals}: XiomeComponentOptions) {
	const {exampleModel} = models
	return {
		XiomeExample:
			mixinMadstateSubscriptions(exampleModel.subscribe)(
				mixinShare({
					modals,
					exampleModel,
				})(XiomeExample)
			),
	}
}
