
import {Validator} from "../../../toolbox/darkvalley.js"
import {ValueChangeEvent} from "./events/value-change-event.js"
import {Component, html, property, mixinStyles} from "../../../framework/component.js"

import styles from "./xio-price-input.css.js"
import svgWarning from "../../../framework/icons/warning.svg.js"
import svgCircleCheck from "../../../framework/icons/circle-check.svg.js"
import chevronUpSvg from "../../../framework/icons/feather/chevron-up.svg.js"
import chevronDownSvg from "../../../framework/icons/feather/chevron-down.svg.js"

enum Operation {
	INCREMENT,
	DECREMENT
}

@mixinStyles(styles)
export class XioPriceInput extends Component {

	@property({type: Number, reflect: true})
	min: number = 1.00

	@property({type: Number, reflect: true})
	max: number = 10.00

	@property({type: String, reflect: true})
	step = "0.5"

	@property({type: Boolean, reflect: true})
	readonly: boolean

	@property({type: String})
	["initial-value"] = ""

	@property({type: String})
	currency = "USD"

	@property({type: String})
	symbol = "$"

	@property({type: String})
	private inputValue: string

	@property({type: Object})
	problems: string[] = []

	@property({type: Boolean})
	private valid = true

	@property({type: Boolean})
	private showValidation = false

	@property({type: Function})
	validator: undefined | Validator<number>

	private get input(): HTMLInputElement {
		return this.shadowRoot
			? this.shadowRoot.querySelector('#price')
			: undefined
	}

	private get inputParent(): HTMLInputElement {
		return this.shadowRoot
			? this.shadowRoot.querySelector('.price__input__parent')
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
		const size = input.value.length > 1 ? input.value.length : 3
		input.style.width = `${size+0.4}ch`
	}

	init(): void {
		this.inputValue = this["initial-value"]
	}

	#validateInput = (value: string) => {
		this.showValidation = true
		this.problems = this.validator ? this.validator(Number(value)) : []
		this.valid = this.problems.length < 1
	}

	#handleButtonClick(type: Operation) {
		const {step, inputValue} = this
		if(type === Operation.INCREMENT)
			this.inputValue = (Number(inputValue) + Number(step)).toFixed(2)
		else if(type === Operation.DECREMENT)
			this.inputValue = (Number(inputValue) - Number(step)).toFixed(2)
		this.#validateInput(this.inputValue)
		this.#resizeInput()
		this.dispatchEvent(new ValueChangeEvent(this.inputValue))
	}

	#handleInputChange = (event: Event) => {
		const input = event.target as HTMLInputElement
		this.inputValue = input.value
		this.#validateInput(this.inputValue)
		this.#resizeInput()
		this.dispatchEvent(new ValueChangeEvent(this.inputValue))
	}

	render() {
		const {
			symbol, currency, inputValue,
			readonly, valid, showValidation, problems
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
			<div class="container">
				<label for="price" part="label"><slot></slot></label>
				<div class="inner__container">
					<button
						?disabled=${readonly}
						@click=${() => this.#handleButtonClick(Operation.DECREMENT)}
						class="decrement">
						${chevronDownSvg}
					</button>
					<div class="price__input__parent" tabindex="-1" ?data-valid=${valid}>
						<span class="symbol">${symbol}</span>
						<input
							?readonly=${readonly}
							@focus=${this.#focusInputParent}
							@blur=${this.#unfocusInputParent}
							@input=${this.#handleInputChange}
							.value=${inputValue}
							type="number"
							id="price"
							style="width: ${inputWidth}ch"
							placeholder="0.00"
						/>
						${icon}
						<span class="currency">${currency}</span>
					</div>
					<button
						?disabled=${readonly}
						@click=${() => this.#handleButtonClick(Operation.INCREMENT)}
						class="increment">
						${chevronUpSvg}
					</button>
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
