
import styles from "./xio-text-input.css.js"
import {noopParser} from "./parsing/noop-parser.js"
import {EnterPressEvent} from "./events/enter-press.js"
import {TextInputParser} from "./types/text-input-parser.js"
import {debounce} from "../../../toolbox/debounce/debounce.js"
import {ValueChangeEvent} from "./events/value-change-event.js"
import {TextInputValidator} from "./types/text-input-validator.js"
import {Component, html, mixinStyles, mixinFocusable, property} from "../../../framework/component.js"

import svgWarning from "../../../framework/icons/warning.svg.js"
import svgCircleCheck from "../../../framework/icons/circle-check.svg.js"

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

	@property({type: Boolean, reflect: true})
	["hidden"]: boolean = false

	private get input(): HTMLInputElement | HTMLTextAreaElement {
		return this.shadowRoot
			? this.shadowRoot.querySelector("#textinput")
			: undefined
	}

	focus() {
		if (this.input)
			this.input.focus()
	}

	@property({type: Function})
	parser: TextInputParser<xParsedValue> = noopParser

	@property({type: Function})
	validator: undefined | TextInputValidator<xParsedValue>

	@property({type: Object})
	problems: string[] = []

	get value(): xParsedValue {
		const {draft} = this
		const parsed = (this.parser ?? noopParser)(draft)
		this.problems = this.validator ? this.validator(parsed) : []
		return this.problems.length === 0
			? parsed
			: undefined
	}

	get text() {
		return this.draft
	}

	@property({type: String})
	set text(value: string) {
		const {input} = this
		if (input) {
			this.input.value = value
			this.updateDraft()
			this.dispatchValueChange()
		}
		else {
			this.initial = value
		}
	}

	onvaluechange: (event: ValueChangeEvent<xParsedValue>) => void =
		() => {}

	onenterpress: (event: EnterPressEvent) => void =
		() => {}

	@property({type: String})
	private draft: string = ""
	private lastDraft: string = ""

	private dispatchValueChange = () => {
		const {draft, lastDraft} = this
		if (draft !== lastDraft)
			this.dispatchEvent(new ValueChangeEvent(this.value))
		this.lastDraft = draft
	}

	private dispatchValueChangeDebounced = debounce(250, this.dispatchValueChange)

	private dispatchEnterPress = () => {
		this.dispatchEvent(new EnterPressEvent())
	}

	private updateDraft = () => {
		this.draft = this.input.value
	}

	private handleInputKeyUp = (event: KeyboardEvent) => {
		this.updateDraft()
		if (event.key === "Enter") {
			const notTextArea = !this.textarea
			const notIgnoring = !event.shiftKey
			console.log({isNotTextArea: notTextArea, isNotIgnoringTheEnterPress: notIgnoring})
			if (notTextArea || notIgnoring) {
				this.dispatchValueChange()
				this.dispatchEnterPress()
				event.preventDefault()
			}
		}
		else {
			this.dispatchValueChangeDebounced()
		}
	}

	private handleInputChange = () => {
		this.updateDraft()
		this.dispatchValueChange()
	}

	init() {
		const {initial} = this
		this.draft = initial
		this.lastDraft = initial
		this.text = initial
		this.addEventListener("valuechange", this.onvaluechange)
		this.addEventListener("enterpress", this.onenterpress)
		this.dispatchValueChange()
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
					<div part=inputbox>
						${showValidation ? icon : null}
						${textarea ? html`
							<textarea
								id=textinput
								part=textinput
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
								?disabled=${disabled}
								?readonly=${readonly}
								tabindex=${readonly ? "-1" : "0"}
								placeholder=${placeholder}
								@keyup=${handleInputKeyUp}
								@change=${handleInputChange}
								/>
						`}
					</div>
					<ol part=problems>
						${showProblems
							? problems.map(problem => html`
								<li>${problem}</li>
							`)
							: null}
					</ol>
				</div>
			</div>
		`
	}
}
