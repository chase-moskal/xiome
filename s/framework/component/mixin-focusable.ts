
import {LitElement} from "lit-element"
import {ConstructorFor} from "../../types/fancy.js"

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
