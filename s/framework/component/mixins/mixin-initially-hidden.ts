
export function mixinInitiallyHidden<C extends CustomElementConstructor>(
		Base: C
	): C {

	return class extends Base {
		connectedCallback() {
			super.connectedCallback()
			if (this.hasAttribute("initially-hidden"))
				this.removeAttribute("initially-hidden")
		}
	}
}
