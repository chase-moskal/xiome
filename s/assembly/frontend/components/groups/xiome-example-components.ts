
import {XiomeComponentOptions} from "../types/xiome-component-options.js"
import {mixinHappy, mixinShare} from "../../../../framework/component/component.js"
import {XiomeExample} from "../../../../features/example/components/xiome-example.js"

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