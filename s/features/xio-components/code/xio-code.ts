
import styles from "./xio-code.css.js"
import clipboardIcon from "../../../framework/icons/clipboard.svg.js"
import {Component, html, mixinStyles, mixinFocusable, property} from "../../../framework/component/component.js"

@mixinFocusable
@mixinStyles(styles)

export class XioCode extends Component {

	@property({type: Boolean, reflect: true})
		copied: boolean = false
		private copyTimeout: any

	private copy(): void{
		const nodes = this.shadowRoot.querySelector("slot").assignedNodes()
		let text = ""
		for (const node of nodes) text += node.textContent
		navigator.clipboard.writeText(text.trim())

		
		this.copied = true
			this.copyTimeout = setTimeout(() => {
				this.copied = false
				this.copyTimeout = undefined
			}, 1000)
	}

	render() {
		return html`
		<button class=container @click=${this.copy}>
		<slot></slot>
		<div class=copy>
		${clipboardIcon}
		</div>
		</button>
		`;
	}

}
