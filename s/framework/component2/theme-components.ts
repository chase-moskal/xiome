
import {mixinStyles} from "./mixins/mixin-styles.js"
import {objectMap} from "../../toolbox/object-map.js"
import {CSS, Constructor, LitBase} from "../component2/component-types.js"

export const themeComponents = <
		xComponents extends {[key: string]: Constructor<LitBase>}
	>(
		theme: CSS,
		components: xComponents
	): xComponents => {

	return objectMap(
		components,
		Component => mixinStyles(theme)(Component),
	)
}
