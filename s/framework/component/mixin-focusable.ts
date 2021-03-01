
import {LitElement} from "lit-element"
import {ConstructorFor} from "../../types/constructor-for.js"

export function mixinFocusable<C extends ConstructorFor<LitElement>>(
		Constructor: C
	): C {
	return class FocusableComponent extends Constructor {
		connectedCallback() {
			super.connectedCallback()
			this.setAttribute("focusable", "")
		}
	}
}
