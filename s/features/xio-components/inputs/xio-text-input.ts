
import styles from "./xio-text-input.css.js"
import {nullParser} from "./parsing/null-parser.js"
import {TextInputParser} from "./types/text-input-parser.js"
import {ValueChangeEvent} from "./events/value-change-event.js"
import {TextInputValidator} from "./types/text-input-validator.js"
import {Component, html, mixinStyles, mixinFocusable, property, query, maybe} from "../../../framework/component.js"

import svgWarning from "../../../framework/icons/warning.svg.js"
import svgCircleCheck from "../../../framework/icons/circle-check.svg.js"
import {EnterPressEvent} from "./events/enter-press.js"

 @mixinFocusable
 @mixinStyles(styles)
export class XioTextInput<xParsedValue = string> extends Component {

	@property({type: String, reflect: true})
	["initial"]: string = ""

	@property({type: Boolean, reflect: true})
	["readonly"]: boolean = false

	@property({type: Boolean, reflect: true})
	["textarea"] = false

	@property({type: Boolean, reflect: true})
	["hide-validation"] = false

	@property({type: Boolean, reflect: true})
	["show-validation-when-empty"] = false

	@property({type: Boolean, reflect: true})
	["disabled"] = false

	@property({type: String, reflect: true})
	["placeholder"]: string = ""

	focus() {
		this.shadowRoot.querySelector<HTMLElement>("#textinput").focus()
	}

	@property({type: Function})
	parser: undefined | TextInputParser<xParsedValue>

	@property({type: Function})
	validator: undefined | TextInputValidator<xParsedValue>

	@property({type: Object})
	problems: string[] = []

	get value(): xParsedValue {
		const {draft} = this
		const parsed = this.parser ? this.parser(draft) : nullParser(draft)
		this.problems = this.validator ? this.validator(parsed) : []
		return this.problems.length === 0
			? parsed
			: undefined
	}

	get text() {
		return this.draft
	}

	set text(value: string) {
		this.input.value = value
		this.updateFromRawInput()
	}

	onvaluechange: (event: ValueChangeEvent<xParsedValue>) => void =
		() => {}

	onenterpress: (event: EnterPressEvent) => void =
		() => {}

	@query("#textinput")
	private input: HTMLInputElement | HTMLTextAreaElement

	@property({type: String})
	private draft: string = ""

	private dispatchValueChange = () => {
		this.dispatchEvent(new ValueChangeEvent(this.value))
	}

	private dispatchEnterPress = () => {
		this.dispatchEvent(new EnterPressEvent())
	}

	private updateFromRawInput = () => {
		this.draft = this.input.value
	}

	private handleInputKeyUp = (event: KeyboardEvent) => {
		this.updateFromRawInput()
		if (!this.textarea && event.key === "Enter") {
			this.dispatchEnterPress()
		}
		else {
			this.dispatchValueChange()
		}
	}

	private handleInputChange = () => {
		this.updateFromRawInput()
		this.dispatchValueChange()
	}

	firstUpdated() {
		this.draft = this.initial
		this.addEventListener("valuechange", this.onvaluechange)
		this.addEventListener("enterpress", this.onenterpress)
	}

	render() {
		const {
			readonly, disabled, problems, draft, placeholder, textarea,
			validator, handleInputKeyUp, handleInputChange,
		} = this
		const valid = problems.length === 0
		const showValidation = !this["hide-validation"] && !readonly && validator && (
			this["show-validation-when-empty"]
				? true
				: draft.length !== 0
		)
		const showProblems = showValidation && !valid
		const icon = showValidation
			? valid
				? svgCircleCheck
				: svgWarning
			: null
		return html`
			<div class=container ?data-valid=${valid}>
				<label for=textinput part=label><slot></slot></label>
				<div class=flexy>
					<div class=inputbox part=inputbox>
						${showValidation ? icon : null}
						${textarea ? html`
							<textarea
								id=textinput
								part=textinput
								.value="${draft}"
								?disabled=${disabled}
								?readonly=${readonly}
								tabindex=${readonly ? "-1" : "0"}
								placeholder=${placeholder}
								@keyup=${handleInputKeyUp}
								@change=${handleInputChange}
							></textarea>
						` : html`
							<input
								id=textinput
								type=text
								part=textinput
								.value="${draft}"
								?disabled=${disabled}
								?readonly=${readonly}
								tabindex=${readonly ? "-1" : "0"}
								placeholder=${placeholder}
								@keyup=${handleInputKeyUp}
								@change=${handleInputChange}
								/>
						`}
					</div>
					<ol class=problems part=problems>
						${maybe(showProblems, problems.map(problem => html`
							<li>${problem}</li>
						`))}
					</ol>
				</div>
			</div>
		`
	}
}
