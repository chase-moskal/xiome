
import styles from "./xio-text-input.css.js"
import {nullParser} from "./parsing/null-parser.js"
import {debounce2} from "../../../toolbox/debounce2.js"
import {TextInputParser} from "./types/text-input-parser.js"
import {ValueChangeEvent} from "./events/value-change-event.js"
import {TextInputValidator} from "./types/text-input-validator.js"
import {Component, html, mixinStyles, property, query, maybe} from "../../../framework/component.js"

import svgWarning from "../../../framework/icons/warning.svg.js"
import svgCircleCheck from "../../../framework/icons/circle-check.svg.js"

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

	@property({type: Number})
	["debounce"] = 200

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

	setText(value: string) {
		this.input.value = value
		this.updateFromRawInput()
	}

	@query("#textinput")
	private input: HTMLInputElement | HTMLTextAreaElement

	@property({type: String})
	private draft: string = ""

	private updateFromRawInput = () => {
		this.draft = this.input.value
		this.dispatchEvent(new ValueChangeEvent(this.value))
	}

	private handleInputChange = debounce2(
		this["debounce"],
		this.updateFromRawInput,
	)

	firstUpdated() {
		this.draft = this.initial
	}

	render() {
		const {
			readonly, disabled, problems, draft, placeholder, textarea,
			validator, handleInputChange,
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
				<label for="textinput" part=label><slot></slot></label>
				<div class=flexy>
					<div class=inputbox>
						${showValidation ? icon : null}
						${textarea ? html`
							<textarea
								id="textinput"
								part=textinput
								.value="${draft}"
								?disabled=${disabled}
								?readonly=${readonly}
								tabindex=${readonly ? "-1" : "0"}
								placeholder=${placeholder}
								@change=${handleInputChange}
								@keyup=${handleInputChange}
							></textarea>
						` : html`
							<input
								id="textinput"
								type=text
								part=textinput
								.value="${draft}"
								?disabled=${disabled}
								?readonly=${readonly}
								tabindex=${readonly ? "-1" : "0"}
								placeholder=${placeholder}
								@change=${handleInputChange}
								@keyup=${handleInputChange}/>
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
