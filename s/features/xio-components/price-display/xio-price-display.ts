
import styles from "./xio-price-display.css.js"
import {Component, html, property, mixinStyles} from "../../../framework/component.js"

@mixinStyles(styles)
export class XioPriceDisplay extends Component {

	@property({type: String})
	symbol: string = "$"

	@property({type: String})
	currency: string = "USD"

	@property({type: String})
	value: string = "9.50"

	private splitValue = this.value.split(".")[0]
	private unit = this.value.split(".")[1]

	render() {
		const {unit, symbol, currency, splitValue} = this
		return html`
			<div class="card2">
				<div class="display">
					<div>
						<strong>
							<span class="symbol">${symbol}</span>
							${splitValue}
						</strong>
						${unit && Number(unit) > 0
								? (html`<span class="superscript">${unit}</span>`)
								: null
							}
					</div>
					<span class="currency">${currency}</span>
				</div>
			</div>
		`
	}
}
