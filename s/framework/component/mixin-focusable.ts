
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

		static get properties() {
			return {
				...(<typeof LitElement><any>Constructor).properties,
				tabindex: {type: Number, reflect: true},
			}
		}

		tabindex=0

		createRenderRoot() {
			return this.attachShadow({mode: "open", delegatesFocus: true})
		}
	})
}
