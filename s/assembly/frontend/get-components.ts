
import theme from "../../framework/theme.css.js"

import {themeComponents} from "../../framework/component.js"
import {xioComponents} from "./component-groups/xio-components.js"
import {xiomeStoreComponents} from "./component-groups/xiome-store-components.js"
import {xiomeAuthComponents} from "./component-groups/xiome-auth-components.js"
import {XiomeComponentOptions} from "./component-groups/types/xiome-component-options.js"

export function getComponents(options: XiomeComponentOptions) {
	return themeComponents(theme, {
		...xioComponents(),
		...xiomeAuthComponents(options),
		...xiomeStoreComponents(options),
	})
}
