
import {LitElement, css} from "lit-element"
import {ConstructorFor} from "../../types.js"
import {mixinStyles} from "./mixin-styles.js"

const styles = css`

:host {
	outline: none !important;
}

`

export function mixinFocusable<C extends ConstructorFor<LitElement>>(
		Constructor: C
	): C {
	return mixinStyles(styles)(class FocusableComponent extends Constructor {

		constructor(...args: any[]) {
			super(...args)
			this.setAttribute("tabindex", "0")
		}

		createRenderRoot() {
			return this.attachShadow({mode: "open", delegatesFocus: true})
		}
	})
}
