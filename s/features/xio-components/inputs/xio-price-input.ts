
import styles from "./xio-price-input.css.js"
import {ValueChangeEvent} from "./events/value-change-event.js"
import {Component, html, property, mixinStyles} from "../../../framework/component.js"

@mixinStyles(styles)
export class XioPriceInput extends Component {

	@property({type: Number, reflect: true})
	min: number = 1.00

	@property({type: Number, reflect: true})
	max: number = 10.00

	@property({type: String, reflect: true})
	step = "0.5"

	@property({type: String})
	["initial-value"] = "9.00"

	@property({type: String})
	currency = "USD"

	@property({type: String})
	symbol = "$"

	@property({type: Boolean})
	valid = true

	@property({type: String})
	private inputValue = this["initial-value"]

	@property({type: Object})
	problems: string[] = []

	@property({type: Function})
	validator: () => string[]

	private get input(): HTMLInputElement {
		return this.shadowRoot
			? this.shadowRoot.querySelector('#price')
			: undefined
	}

	private get inputParent(): HTMLInputElement {
		return this.shadowRoot
			? this.shadowRoot.querySelector('.price-input')
			: undefined
	}

	#focusInputParent = () => {
		this.inputParent.classList.add('focussed')
	}

	#unfocusInputParent = () => {
		this.inputParent.classList.remove('focussed')
	}

	#resizeInput = () => {
		const size = this.input.value.length > 2 ? this.input.value.length : 3
		this.input.style.width = size + "ch"
	}

	#validateInput = (value: number) => {
		const {min, max} = this
		this.valid = value >= min && value <= max
		if(this.valid) {
			this.dispatchEvent(new ValueChangeEvent(this.inputValue))
		}
	}

	#increment = () => {
		const {step, inputValue} = this
		const newValue = (Number(inputValue) + Number(step)).toFixed(2)
		this.#validateInput(Number(newValue))
		this.inputValue = newValue
		this.#resizeInput()
	}

	#decrement = () => {
		const {step, inputValue} = this
		const newValue = (Number(inputValue) - Number(step)).toFixed(2)
		this.#validateInput(Number(newValue))
		this.inputValue = newValue
		this.#resizeInput()
	}

	#handleInputChange = (event: Event) => {
		const input = event.target as HTMLInputElement
		this.inputValue = input.value
		this.#validateInput(Number(this.inputValue))
		this.#resizeInput()
	}

	render() {
		const {symbol, currency, inputValue, valid} = this
		const inputWidth = this["initial-value"]
			? this["initial-value"].length
			: 4
		return html`
			<label for="price" part="label"><slot></slot></label>
			<div>
				<button @click=${this.#decrement}>-</button>
				<div class="price-input" tabindex="-1">
					<span class="symbol">${symbol}</span>
					<input
						@focus=${this.#focusInputParent}
						@blur=${this.#unfocusInputParent}
						@input=${this.#handleInputChange}
						.value=${inputValue}
						type="number"
						id="price"
						style="width: ${inputWidth}ch"
					/>
					<span>${currency}</span>
				</div>
				<button @click=${this.#increment}>+</button>
			</div>
			${!valid 
				? html
					`<ul><li>invalid input</li></ul>`
				: null
			}
		`
	}
}
