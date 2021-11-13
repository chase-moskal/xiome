
import styles from "./xio-code.css.js"
import clipboardIcon from "../../../framework/icons/clipboard.svg.js"
import {Component, html, mixinStyles, mixinFocusable, property} from "../../../framework/component.js"
import {makeClipboardCopier} from "../../../toolbox/clipboard-copier.js"
import {blurActiveElement} from "../../../toolbox/blur.js"

@mixinFocusable
@mixinStyles(styles)
export class XioCode extends Component {

	@property({type: Boolean, reflect: true})
	copied: boolean = false

	#copier = makeClipboardCopier({
		setCopied: copied => this.copied = copied
	})

	#getCodeText() {
		const nodes = this.shadowRoot.querySelector("slot").assignedNodes()
		let text = ""
		for (const node of nodes)
			text += node.textContent
		return text.trim()
	}

	async #copy() {
		blurActiveElement()
		const text = this.#getCodeText()
		await this.#copier.copy(text)
	}

	render() {
		return html`
			<button @click=${() => this.#copy()}>
				<slot></slot>
				<div class=copy-icon>
					${clipboardIcon}
				</div>
			</button>
		`
	}

}
