
import styles from "./xio-checkbox.css.js"
import {CheckEvent} from "./events/check-event.js"
import {Component, html, mixinStyles, property, mixinFocusable} from "../../../framework/component.js"

import {Op, ops} from "../../../framework/ops.js"
import checkIcon from "../../../framework/icons/check.svg.js"
import spinnerIcon from "../../../framework/icons/spinner.svg.js"
import warningIcon from "../../../framework/icons/warning.svg.js"

@mixinFocusable
@mixinStyles(styles)
export class XioCheckbox extends Component {

	@property()
	private loading: Op<boolean> = ops.none()

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

	init() {
		this.loading = ops.ready(this["initially-checked"])
	}

	get checked() {
		return ops.value(this.loading)
	}

	set checked(value: boolean) {
		this.loading = ops.ready(value)
	}

	async toggle(previousChecked = ops.value(this.loading), dispatchEvent = true) {
		const checked = !previousChecked
		const isNotDisabled = !this.disabled
		const isLoadingDone = ops.isReady(this.loading)
		return (isNotDisabled && isLoadingDone)
			? ops.operation({
				setOp: op => this.loading = op,
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
		if (!this.disabled) {
			this.toggle()
			const activeElement = <HTMLElement>document.activeElement
			if (activeElement) activeElement.blur()
		}
	}

	render() {
		return html`
			<button
				data-mode="${ops.mode(this.loading)}"
				?data-checked=${ops.value(this.loading)}
				@click=${this.handleClick}>
					${ops.select(this.loading, {
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
