
import {XiomeExample} from "./xiome-example/xiome-example.js"
import {mixinSnapstateSubscriptions, mixinShare} from "../../../framework/component.js"
import {XiomeComponentOptions} from "../../../assembly/frontend/components/types/xiome-component-options.js"

export function integrateExampleComponents({models, modals}: XiomeComponentOptions) {
	const {exampleModel} = models
	return {
		XiomeExample: (
			mixinSnapstateSubscriptions(exampleModel.subscribe)(
				mixinShare({
					modals,
					exampleModel,
				})(XiomeExample)
			)
		),
	}
}
