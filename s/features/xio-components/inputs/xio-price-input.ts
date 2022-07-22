
import styles from "./xio-price-input.css.js"
import {ValueChangeEvent} from "./events/value-change-event.js"
import {Component, html, property, mixinStyles} from "../../../framework/component.js"
import svgCircleCheck from "../../../framework/icons/circle-check.svg.js"
import svgWarning from "../../../framework/icons/warning.svg.js"
import {max, min, notWhitespace, validator} from "../../../toolbox/darkvalley.js"
import {debounce} from "@chasemoskal/snapstate"

@mixinStyles(styles)
export class XioPriceInput extends Component {

	@property({type: Number, reflect: true})
	min: number = 1.00

	@property({type: Number, reflect: true})
	max: number = 10.00

	@property({type: String, reflect: true})
	step = "0.5"

	@property({type: String})
	["initial-value"] = ""

	@property({type: String})
	currency = "USD"

	@property({type: String})
	symbol = "$"

	@property({type: String})
	private inputValue = this["initial-value"]

	@property({type: Object})
	private problems: string[] = []

	@property({type: Boolean})
	private valid = true

	@property({type: Boolean})
	private showValidation = false

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

	get value() {
		return this.valid ? this.inputValue : undefined
	}

	#focusInputParent = () => {
		this.inputParent.classList.add('focussed')
	}

	#unfocusInputParent = () => {
		this.inputParent.classList.remove('focussed')
	}


	#resizeInput = () => {
		const {input} = this
		const size = input.value.length > 2 ? input.value.length : 3
		input.style.width = `${size+0.4}ch`
	}

	#validatePrice = validator(
		min(Number(this.min)),
		max(Number(this.max))
	)

	#validateInput = (value: string) => {
		this.showValidation = true
		this.problems = this.#validatePrice(Number(value))
		this.valid = this.problems.length < 1
		if(this.valid) {
			this.dispatchEvent(new ValueChangeEvent(this.inputValue))
		}
	}

	#validateInputDebounced = debounce(250, this.#validateInput)

	#increment = () => {
		const {step, inputValue} = this
		const newValue = (Number(inputValue) + Number(step)).toFixed(2)
		this.#validateInputDebounced(newValue)
		this.inputValue = newValue
		this.#resizeInput()
	}

	#decrement = () => {
		const {step, inputValue} = this
		const newValue = (Number(inputValue) - Number(step)).toFixed(2)
		this.#validateInputDebounced(newValue)
		this.inputValue = newValue
		this.#resizeInput()
	}

	#handleInputChange = (event: Event) => {
		const input = event.target as HTMLInputElement
		this.inputValue = input.value
		this.#validateInputDebounced(this.inputValue)
		this.#resizeInput()
	}

	render() {
		const {
			symbol, currency, inputValue, valid, showValidation, problems
		} = this
		const inputWidth = this["initial-value"]
			? this["initial-value"].length
			: 4
		const icon = showValidation
			? valid
				? svgCircleCheck
				: svgWarning
			: null
		return html`
			<div class="container" ?data-valid=${valid}>
				<label for="price" part="label"><slot></slot></label>
				<div class="inner__container">
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
							placeholder="0.00"
						/>
						<span>${currency}</span>
						${icon}
					</div>
					<button @click=${this.#increment}>+</button>
				</div>
				<ul part=problems>
					${!valid
						? problems.map(problem => html`
							<li>${problem}</li>
						`)
						: null
					}
				</ul>
			</div>
		`
	}
}
