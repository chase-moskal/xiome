
import {Constructor, CustomElement} from "../component-types.js"

export function mixinInitiallyHidden<
		C extends Constructor<CustomElement>
	>(Base: C) {
	return class extends Base {
		connectedCallback() {
			super.connectedCallback()
			if (this.hasAttribute("initially-hidden"))
				this.removeAttribute("initially-hidden")
		}
	}
}
