
import styles from "./xio-checkbox.css.js"
import {CheckEvent} from "./events/check-event.js"
import {loading} from "../../../framework/loading/loading.js"
import {Component, html, mixinStyles, property, mixinFocusable} from "../../../framework/component.js"

import checkIcon from "../../../framework/icons/check.svg.js"
import spinnerIcon from "../../../framework/icons/spinner.svg.js"
import warningIcon from "../../../framework/icons/warning.svg.js"

@mixinFocusable
@mixinStyles(styles)
export class XioCheckbox extends Component {

	private loading = loading<boolean>()

	@property({type: Boolean})
	["initially-checked"]: boolean = false

	@property({type: String})
	["error-message"]: string = "error"

	@property({type: Boolean, reflect: true})
	disabled = false

	@property({type: Function})
	oncheck: (event: CheckEvent) => void

	@property({type: Function})
	save: (checked: boolean) => Promise<void>

	firstUpdated() {
		this.loading.actions.setReady(this["initially-checked"])
	}

	async toggle(previousChecked = this.loading.view.payload, dispatchEvent = true) {
		const checked = !previousChecked
		const isNotDisabled = !this.disabled
		const loadingIsDone = this.loading.view.ready
		return (isNotDisabled && loadingIsDone)
			? this.loading.actions.setLoadingUntil({
				errorReason: this["error-message"],
				promise: (async() => {
					await (this.save ?? (async() => {}))(checked)
					if (dispatchEvent) {
						const event = new CheckEvent(this)
						if (this.oncheck) this.oncheck(event)
						this.dispatchEvent(event)
						event.stopPropagation()
					}
					return checked
				})(),
			})
			: checked
	}

	private handleClick = () => {
		this.toggle()
		const activeElement = <HTMLElement>document.activeElement
		if (activeElement) activeElement.blur()
	}

	render() {
		return html`
			<button
				data-mode="${this.loading.view.mode}"
				?data-checked=${this.loading.view.payload}
				@click=${this.handleClick}>
					${this.loading.view.select({
						none: () => null,
						loading: () => spinnerIcon,
						error: reason => html`${warningIcon}<div class=error>${reason}</div>`,
						ready: checked => checked
							? checkIcon
							: null,
					})}
			</button>
		`
	}
}
