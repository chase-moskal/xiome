
import theme from "../../../framework/theme.css.js"
import {XiomeComponentOptions} from "./types/xiome-component-options.js"
import {themeComponents} from "../../../framework/component/component.js"

import {xioComponents} from "./groups/xio-components.js"
import {xiomeAuthComponents} from "./groups/xiome-auth-components.js"
import {xiomeExampleComponents} from "./groups/xiome-example-components.js"
import {xiomeQuestionsComponents} from "./groups/xiome-questions-components.js"
import {xiomeAdministrativeComponents} from "./groups/xiome-administrative-components.js"

export function getComponents(options: XiomeComponentOptions) {
	return themeComponents(theme, {
		...xioComponents(),
		...xiomeExampleComponents(options),
		...xiomeAuthComponents(options),
		...xiomeQuestionsComponents(options),
		...xiomeAdministrativeComponents(options),

		// // TODO reactivate store
		// ...xiomeStoreComponents(options),
	})
}
