
import styles from "./xio-id.css.js"
import clipboardIcon from "../../../framework/icons/clipboard.svg.js"
import {Component, html, mixinStyles, property, mixinFocusable} from "../../../framework/component.js"

@mixinFocusable
@mixinStyles(styles)
export class XioId extends Component {

	@property()
	id: string

	@property({type: Boolean, reflect: true})
	copied: boolean = false

	private copyTimeout: any

	private async copy() {
		try {
			await navigator.clipboard.writeText(this.id)
			const activeElement = <HTMLElement>document.activeElement
			if (activeElement) activeElement.blur()

			if (this.copyTimeout) {
				clearTimeout(this.copyTimeout)
			}

			this.copied = true
			this.copyTimeout = setTimeout(() => {
				this.copied = false
				this.copyTimeout = undefined
			}, 1000)
		}
		catch (error) {
			console.error("failed to copy")
		}
	}

	render() {
		return html`
			<button class=container @click=${this.copy}>
				<div class=id>${this.id}</div>
				<div class=copy>
					${clipboardIcon}
				</div>
			</button>
		`
	}
}
