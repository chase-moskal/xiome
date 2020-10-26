
import {LitElement} from "lit-element"
import {ConstructorFor} from "../types.js"
import {mixinStyles, CSS} from "./mixin-styles.js"
import {objectMap} from "../toolbox/object-map.js"

export const themeComponents = <C extends ConstructorFor<LitElement>>(
	theme: CSS,
	components: {[key: string]: C}
) => {
	const mixinTheme = mixinStyles(theme)
	return objectMap(components, Component => mixinTheme(Component))
}
