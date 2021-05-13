
import styles from "./xio-button.css.js"
import {PressEvent} from "./events/press-event.js"
import {Component2, html, mixinStyles, property, mixinFocusable} from "../../../framework/component2/component2.js"

@mixinFocusable
@mixinStyles(styles)
export class XioButton extends Component2 {

	@property({type: Boolean, reflect: true})
	["disabled"] = false

	@property({type: Function})
	onpress: (event: PressEvent) => void

	focus() {
		this.shadowRoot.querySelector("button").focus()
	}

	private handleClick = () => {
		const event = new PressEvent(this)
		if (this.onpress) this.onpress(event)
		if (!this.disabled) this.dispatchEvent(event)
		event.stopPropagation()
	}

	render() {
		return html`
			<button
				part=button
				@click=${this.handleClick}
				?disabled=${this.disabled}>
					<slot></slot>
			</button>
		`
	}
}
