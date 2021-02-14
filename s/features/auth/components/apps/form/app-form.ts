
import {deepEqual} from "../../../../../toolbox/deep.js"
import {html} from "../../../../../framework/component.js"
import {Validator} from "../../../../../toolbox/darkvalley.js"
import {parseOrigins} from "../../../topics/apps/parse-origins.js"
import {validateAppFormDraft} from "./utils/validate-app-form-draft.js"
import {getEmptyAppFormDraft} from "./utils/get-empty-app-form-draft.js"
import {appDraftValidators} from "../../../topics/apps/app-draft-validators.js"
import {XioTextInput} from "../../../../xio-components/inputs/xio-text-input.js"

import {AppFormDraft} from "./types/app-form-draft.js"
import {TextInputParser} from "../../../../xio-components/inputs/types/text-input-parser.js"

export function makeAppForm({
		clearOnSubmit,
		submitButtonText,
		initialValues = getEmptyAppFormDraft(),
		query,
		submit,
		requestUpdate,
	}: {
		clearOnSubmit: boolean
		submitButtonText: string
		initialValues?: AppFormDraft
		requestUpdate: () => void
		submit: (draft: AppFormDraft) => Promise<void>
		query: <E extends HTMLElement>(selector: string) => E
	}) {

	const state = {
		problems: [],
		formDisabled: false,
		draft: initialValues,
		get valid(): boolean {
			return !this.formDisabled
				&& this.draft
				&& this.problems.length === 0
		},
	}

	function getFormElements() {
		return {
			home: query<XioTextInput>(`.app-form [data-form="home"]`),
			label: query<XioTextInput>(`.app-form [data-form="label"]`),
			additionalOrigins: query<XioTextInput<string[]>>(`.app-form [data-form="additional-origins"]`),
		}
	}

	function setFormValues(draft: AppFormDraft) {
		const elements = getFormElements()
		elements.home.setText(draft.home)
		elements.label.setText(draft.label)
		elements.additionalOrigins.setText(draft.additionalOrigins.join("\n"))
	}

	const refreshAndValidateForm = () => {
		const {home, label, additionalOrigins} = getFormElements()
		state.draft = {
			home: home.value,
			label: label.value,
			additionalOrigins: additionalOrigins.value,
		}
		state.problems = validateAppFormDraft(state.draft)
		requestUpdate()
	}

	function handleFormChange() {
		state.problems = []
		if (!state.formDisabled)
			refreshAndValidateForm()
	}

	async function handleSubmitClick() {
		refreshAndValidateForm()
		state.formDisabled = true
		requestUpdate()
		try {
			await submit(state.draft)
			if (clearOnSubmit) {
				initialValues = getEmptyAppFormDraft()
				setFormValues(initialValues)
			}
			else {
				initialValues = state.draft
			}
		}
		finally {
			state.formDisabled = false
			requestUpdate()
		}
	}

	function render() {
		const {formDisabled, draft, problems} = state
		const changes = !deepEqual(initialValues, draft)
		const submitButtonDisabled = !changes
			|| formDisabled
			|| problems.length > 0
		const exportPartsTextInput = `
			textinput: appform-xiotextinput-textinput,
			label: appform-xiotextinput-label,
			problems: appform-xiotextinput-problems,
		`
		const renderTextInput = <xValue = string>({
				textarea, label, dataForm, initialText, showValidationWhenEmpty,
				parser, validator,
			}: {
				textarea: boolean
				label: string
				dataForm: string
				initialText: string
				showValidationWhenEmpty: boolean
				validator: Validator<xValue>
				parser: TextInputParser<xValue>
			}) => html`
			<xio-text-input
				?textarea=${textarea}
				part=appform-xiotextinput
				exportparts=${exportPartsTextInput}
				data-form="${dataForm}"
				initial="${initialText}"
				?disabled=${formDisabled}
				?hide-validation=${!changes}
				?show-validation-when-empty=${showValidationWhenEmpty}
				.parser=${parser}
				.validator=${validator}
				@valuechange=${handleFormChange}>
					<span part=xio-text-input-label>
						${label}
					</span>
			</xio-text-input>
		`
		return html`
			<div class=app-form>
				<slot name=create-app-heading></slot>

				${renderTextInput({
					textarea: false,
					dataForm: "label",
					label: "community label",
					initialText: initialValues.label,
					showValidationWhenEmpty: false,
					parser: undefined,
					validator: appDraftValidators.label,
				})}

				${renderTextInput({
					textarea: false,
					dataForm: "home",
					label: "website homepage",
					initialText: initialValues.home,
					showValidationWhenEmpty: false,
					parser: undefined,
					validator: appDraftValidators.home,
				})}

				${renderTextInput<string[]>({
					textarea: true,
					dataForm: "additional-origins",
					label: "additional origins (optional)",
					initialText: initialValues.additionalOrigins.join("\n"),
					showValidationWhenEmpty: true,
					parser: parseOrigins,
					validator: appDraftValidators.additionalOrigins,
				})}

				<xio-button
					class="create-app-button"
					?disabled=${submitButtonDisabled}
					@press=${handleSubmitClick}>
						${submitButtonText}
				</xio-button>
			</div>
		`
	}

	return {render}
}
