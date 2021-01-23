
import {FarmExample} from "./zapcomponents/farm-example.js"
import {registerComponents, themeComponents} from "./framework/component.js"

import theme from "./theme.css.js"

void async function platform() {
	registerComponents(themeComponents(theme, {
		FarmExample,
	}))
}()
