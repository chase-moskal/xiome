
import theme from "../../framework/theme.css.js"

import {xioComponents} from "./component-groups/xio-components.js"
import {themeComponents} from "../../framework/component2/component2.js"
import {xiomeAuthComponents} from "./component-groups/xiome-auth-components.js"
// import {xiomeStoreComponents} from "./component-groups/xiome-store-components.js"
import {XiomeComponentOptions} from "./component-groups/types/xiome-component-options.js"
import {xiomeQuestionsComponents} from "./component-groups/xiome-questions-components.js"
import {xiomeAdministrativeComponents} from "./component-groups/xiome-administrative-components.js"

export function getComponents(options: XiomeComponentOptions) {
	return themeComponents(theme, {
		...xioComponents(),
		...xiomeAuthComponents(options),

		// // TODO reactivate store
		// ...xiomeStoreComponents(options),

		...xiomeQuestionsComponents(options),
		...xiomeAdministrativeComponents(options),
	})
}
