
import xioMenuItemCss from "./styles/xio-menu-item.css.js"
import {Component, property, html, mixinStyles} from "../../../framework/component.js"

@mixinStyles(xioMenuItemCss)
export class XioMenuItem extends Component {

	@property({type: String, reflect: true})
	theme = ""

	@property({type: Boolean, reflect: true})
	lefty = false

	@property({type: Boolean, reflect: true})
	open = false

	toggle = () => {}

	updated(changedProperties: any) {
		if (changedProperties.has("open") && this.open)
			this.shadowRoot.querySelector("button").focus()
	}

	#handleButtonClick = () => {
		this.toggle()
	}

	render() {
		return html`
			<div class=display>
				<button @click=${this.#handleButtonClick}>
					<slot name=button></slot>
				</button>
				<div class=panel>
					<slot></slot>
				</div>
			</div>
		`
	}
}
