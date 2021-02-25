
import {LitElement} from "lit-element"
import {ConstructorFor} from "../../types/fancy.js"

export function mixinLightDom<C extends ConstructorFor<LitElement>>(
		Constructor: C
	): C {
	return class Component extends Constructor {
		createRenderRoot() {
			return this
		}
	}
}
