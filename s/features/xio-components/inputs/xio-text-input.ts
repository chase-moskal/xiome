
import styles from "./xio-text-input.css.js"
import {debounce2} from "../../../toolbox/debounce2.js"
import {TextInputParser} from "./types/text-input-parser.js"
import {ValueChangeEvent} from "./events/text-change-event.js"
import {TextInputValidator} from "./types/text-input-validator.js"
import {Component, html, mixinStyles, property, query, maybe} from "../../../framework/component.js"

import svgWarning from "../../../framework/icons/warning.svg.js"
import svgCircleCheck from "../../../framework/icons/circle-check.svg.js"

 @mixinStyles(styles)
export class XioTextInput<xParsedValue = string> extends Component {

	@property({type: String, reflect: true})
	["initial"]: string = ""

	@property({type: Boolean, reflect: true})
	["textarea"] = false

	@property({type: Boolean, reflect: true})
	["show-validation-when-empty"] = false

	@property({type: Boolean, reflect: true})
	["disabled"] = false

	@property({type: String, reflect: true})
	["placeholder"]: string = ""

	@property({type: Function})
	parser: TextInputParser<xParsedValue> =
		(text: string) => <xParsedValue><unknown>text

	@property({type: Function})
	validator: TextInputValidator<xParsedValue> = () => []

	@property({type: Object})
	problems: string[] = []

	get value(): xParsedValue {
		const {draft} = this
		const parsed = this.parser(draft)
		this.problems = this.validator(parsed)
		return this.problems.length === 0
			? parsed
			: undefined
	}

	setText(value: string) {
		this.input.value = value
		this.updateFromRawInput()
	}

	@query(".input")
	private input: HTMLInputElement | HTMLTextAreaElement

	@property({type: String})
	private draft: string = ""

	private updateFromRawInput = () => {
		this.draft = this.input.value
		const {value} = this
		this.dispatchEvent(new ValueChangeEvent(value))
	}

	private handleInputChange = debounce2(500, this.updateFromRawInput)

	firstUpdated() {
		this.draft = this.initial
	}

	render() {
		const {problems, draft, placeholder, validator, handleInputChange} = this
		const valid = problems.length === 0
		const showValidation = validator && (
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
			<div class=container>
				<div class=mainbox>
					${this["textarea"] ? html`
						<textarea
							class=input
							.value="${draft}"
							?disabled=${this["disabled"]}
							placeholder=${placeholder}
							@change=${handleInputChange}
							@keyup=${handleInputChange}
						></textarea>
					` : html`
						<input
							type=text
							class=input
							.value="${draft}"
							?disabled=${this["disabled"]}
							placeholder=${placeholder}
							@change=${handleInputChange}
							@keyup=${handleInputChange}/>
					`}
					${showValidation ? icon : null}
				</div>
				${maybe(showProblems, html`
					<ol class=problems>
						${this.problems.map(problem => html`
							<li>${problem}</li>
						`)}
					</ol>
				`)}
			</div>
		`
	}
}
