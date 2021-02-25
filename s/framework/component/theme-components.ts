
import {LitElement} from "lit-element"

import {mixinStyles, CSS} from "./mixin-styles.js"
import {objectMap} from "../../toolbox/object-map.js"

import {ConstructorFor} from "../../types/fancy.js"

export const themeComponents = <
		xComponents extends {[key: string]: ConstructorFor<LitElement>}
	>(
		theme: CSS,
		components: xComponents
	): xComponents => {

	return objectMap(
		components,
		Component => mixinStyles(theme)(Component),
	)
}
