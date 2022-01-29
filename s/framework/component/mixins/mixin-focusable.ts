
export function mixinFocusable<C extends CustomElementConstructor>(
		Base: C
	): C {

	return class extends Base {
		connectedCallback() {
			super.connectedCallback()
			this.setAttribute("focusable", "")
		}
	}
}
