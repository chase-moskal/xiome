
import {LitElement} from "lit-element"
import {ConstructorFor} from "../types.js"

export function mixinInitiallyHidden<C extends ConstructorFor<LitElement>>(
		Constructor: C
	): C {
	return class Component extends Constructor {
		firstUpdated() {
			if (this.hasAttribute("initially-hidden"))
				this.removeAttribute("initially-hidden")
		}
	}
}
