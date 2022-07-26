
import styles from "./xio-price-display.css.js"
import {Component, html, property, mixinStyles} from "../../../framework/component.js"

@mixinStyles(styles)
export class XioPriceDisplay extends Component {

	@property({type: String, reflect: true})
	symbol: string = "$"

	@property({type: String, reflect: true})
	currency: string = "USD"

	@property({type: Boolean, reflect: true})
	["unit-superscript"]: boolean = true

	@property({type: String})
	value: string = "9.50"

	private splitValue = this.value.split(".")[0]
	private unit = this.value.split(".")[1]
	private unitIsGreaterThanZero = this.unit && Number(this.unit) > 0

	#renderWhenSuperscriptIsDisabled = () => {
		const {unit, splitValue, unitIsGreaterThanZero} = this
		return html`
			<strong>
				${`${splitValue}${unitIsGreaterThanZero ? `.${unit}` : null}`}
			</strong>
		`
	}

	#renderWhenSupercriptIsEnabled = () => {
		const {unit, splitValue, unitIsGreaterThanZero} = this
		return html`
			<div class="superscript">
				<strong>${splitValue}</strong>
				${unitIsGreaterThanZero
						? (html`<span>${unit}</span>`)
						: null
					}
			</div>
		`
	}

	render() {
		const enableSuperscript = this["unit-superscript"]
		const {symbol, currency} = this
		return html`
			<div class="card2">
				<div class="display">
					<span class="symbol">${symbol}</span>
					${enableSuperscript
						? this.#renderWhenSupercriptIsEnabled()
						: this.#renderWhenSuperscriptIsDisabled()
					}
					<span class="currency">${currency}</span>
				</div>
			</div>
		`
	}
}
