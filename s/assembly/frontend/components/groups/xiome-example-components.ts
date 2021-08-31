
import {XiomeComponentOptions} from "../types/xiome-component-options.js"
import {mixinHappy, mixinShare} from "../../../../framework/component/component.js"
import {XiomeExample} from "../../../../features/example/component/xiome-example.js"

export function xiomeExampleComponents({models, modals}: XiomeComponentOptions) {
	const {exampleModel} = models
	return {
		XiomeExample:
			mixinHappy(exampleModel.onStateChange)(
				mixinShare({
					modals,
					exampleModel,
				})(XiomeExample)
			),
	}
}
