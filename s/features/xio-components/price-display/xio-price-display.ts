
import styles from "./xio-price-display.css.js"
import {Component, html, property, mixinStyles} from "../../../framework/component.js"

@mixinStyles(styles)
export class XioPriceDisplay extends Component {

	@property({type: String, reflect: true})
	symbol: string = "$"

	@property({type: String, reflect: true})
	currency: string = "USD"

	@property({type: Boolean, reflect: true})
	["unit-superscript"]: boolean

	@property({type: Boolean, reflect: true})
	["vertical-currency"]: boolean

	@property({type: String})
	value: string = "9.50"

	#leftPadCents(cents: string) {
		return cents.length > 1 ? cents : `0${cents}`
	}

	#getPriceDetails() {
		const {value} = this
		const numerical = parseFloat(value)
		const dollars = Math.floor(numerical)
		const cents = Math.round((numerical % 1.0) * 100)
		const strings = {
			dollars: dollars.toString(),
			cents: this.#leftPadCents(cents.toString()),
		}
		return strings
	}

	#renderWhenSuperscriptIsDisabled = () => {
		const {cents, dollars} = this.#getPriceDetails()
		return html`
			<strong>
				${`${dollars}.${cents}`}
			</strong>
		`
	}

	#renderWhenSupercriptIsEnabled = () => {
		const {cents, dollars} = this.#getPriceDetails()
		return html`
			<strong>${dollars}</strong>
			<span class="superscript">${cents}</span>
		`
	}

	render() {
		const enableSuperscript = this["unit-superscript"]
		const enableVerticalCurrency = this["vertical-currency"]
		const {symbol, currency} = this
		return html`
			<div class="card">
				<div class="display">
					<span class="symbol">${symbol}</span>
					${enableSuperscript
						? this.#renderWhenSupercriptIsEnabled()
						: this.#renderWhenSuperscriptIsDisabled()}
					<span class=${`currency ${enableVerticalCurrency ? 'vertical' : ''}`}>
						${currency}
					</span>
				</div>
			</div>
		`
	}
}
