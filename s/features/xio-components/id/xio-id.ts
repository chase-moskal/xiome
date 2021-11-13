
import styles from "./xio-id.css.js"
import {blurActiveElement} from "../../../toolbox/blur.js"
import {makeClipboardCopier} from "../../../toolbox/clipboard-copier.js"
import {AutowatcherComponent, html, mixinStyles, property, mixinFocusable} from "../../../framework/component.js"

import clipboardIcon from "../../../framework/icons/clipboard.svg.js"

@mixinFocusable
@mixinStyles(styles)
export class XioId extends AutowatcherComponent {

	@property()
	id: string

	@property({type: Boolean, reflect: true})
	copied: boolean = false

	#copier = makeClipboardCopier({
		setCopied: copied => this.copied = copied,
	})

	async #copy() {
		blurActiveElement()
		await this.#copier.copy(this.id)
	}

	render() {
		return html`
			<button class=container @click=${this.#copy}>
				<div class=id>${this.id}</div>
				<div class=copy>
					${clipboardIcon}
				</div>
			</button>
		`
	}
}
