
import styles from "./xio-price-input.css.js"
import {Component, html, property, mixinStyles} from "../../../framework/component.js"

@mixinStyles(styles)
export class XioPriceInput extends Component {

	@property({type: String})
	["initial-value"] = "9.00"

	@property({type: String, reflect: true})
	currency = "USD"

	@property({type: String, reflect: true})
	symbol = "$"

	@property({type: String, reflect: true})
	min = "1.00"

	@property({type: String, reflect: true})
	max = "100.00"

	@property({type: String, reflect: true})
	step = "0.5"

	@property({type: String})
	private inputValue = this["initial-value"]

	private get input(): HTMLInputElement {
		return this.shadowRoot
			? this.shadowRoot.querySelector('#price')
			: undefined
	}

	#resizeInput = () => {
		const size = this.input.value.length
		this.input.style.width = size + "ch"
	}

	#handleInputChange = (event: Event) => {
		const input = event.target as HTMLInputElement
		this.inputValue = input.value
		this.#resizeInput()
	}

	#increment = () => {
		const {step, inputValue} = this
		const newValue = (Number(inputValue) + Number(step)).toFixed(2)
		this.inputValue = newValue
		this.#resizeInput()
	}

	#decrement = () => {
		const {step, inputValue} = this
		const newValue = (Number(inputValue) - Number(step)).toFixed(2)
		this.inputValue = newValue
		this.#resizeInput()
	}

	render() {
		const {symbol, currency, inputValue} = this
		const inputWidth = this["initial-value"]
			? this["initial-value"].length
			: 4
		return html`
			<div>
				<button @click=${this.#decrement}>-</button>
				<div class="price-input">
					<span class="symbol">${symbol}</span>
					<input
						@input=${this.#handleInputChange}
						value=${inputValue}
						type="number"
						id="price"
						style="width: ${inputWidth}ch"
					/>
					<span>${currency}</span>
				</div>
				<button @click=${this.#increment}>+</button>
			</div>

		`
	}
}
