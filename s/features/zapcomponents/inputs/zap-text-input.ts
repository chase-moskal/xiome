
import styles from "./zap-text-input.css.js"
import {debounce2} from "../../../toolbox/debounce2.js"
import {TextChangeEvent} from "./events/text-change-event.js"
import svgWarning from "../../../framework/icons/warning.svg.js"
import {TextInputValidator} from "./types/text-input-validator.js"
import svgCircleCheck from "../../../framework/icons/circle-check.svg.js"
import {Component, html, mixinStyles, property, query, maybe} from "../../../framework/component.js"

 @mixinStyles(styles)
export class ZapTextInput extends Component {

	@property({type: Boolean, reflect: true})
	["show-validation-when-empty"] = false

	@property({type: String, reflect: true})
	["placeholder"]: string = ""

	@property({type: Function})
	validator: TextInputValidator = undefined

	@property({type: Object})
	problems: string[] = []

	get text(): string {
		const {draft, validator} = this
		return validator
			? validator(draft).length === 0
				? draft
				: undefined
			: draft
	}

	set text(value: string) {
		this.input.value = value
	}

	@query("input")
	private input: HTMLInputElement

	@property({type: String})
	private draft: string = ""

	private handleInputChange = debounce2(500, () => {
		const {value} = this.input
		this.draft = value
		this.problems = this.validator
			? this.validator(value)
			: []
		this.dispatchEvent(new TextChangeEvent())
	})

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
					<input
						type=text
						.value="${draft}"
						placeholder=${placeholder}
						@change=${handleInputChange}
						@keyup=${handleInputChange}/>
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
