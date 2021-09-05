
import theme from "../../../framework/theme.css.js"
import {XiomeComponentOptions} from "./types/xiome-component-options.js"
import {themeComponents} from "../../../framework/component/component.js"

import {integrateExampleComponents} from "../../../features/example/components/integrate-example-components.js"

import {xioComponents} from "./groups/xio-components.js"
import {xiomeAuthComponents} from "./groups/xiome-auth-components.js"
import {xiomeQuestionsComponents} from "./groups/xiome-questions-components.js"
import {xiomeAdministrativeComponents} from "./groups/xiome-administrative-components.js"
import {xiomeLivestreamComponents} from "./groups/xiome-livestream-components.js"

export function getComponents(options: XiomeComponentOptions) {
	return themeComponents(theme, {
		...xioComponents(),
		...integrateExampleComponents(options),
		...xiomeAuthComponents(options),
		...xiomeQuestionsComponents(options),
		...xiomeAdministrativeComponents(options),
		...xiomeLivestreamComponents(options),

		// // TODO reactivate store
		// ...xiomeStoreComponents(options),
	})
}
