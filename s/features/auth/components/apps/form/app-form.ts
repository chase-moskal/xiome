
import {deepEqual} from "../../../../../toolbox/deep.js"
import {html} from "../../../../../framework/component.js"
import {parseOrigins} from "../../../topics/apps/parse-origins.js"
import {validateAppFormDraft} from "./utils/validate-app-form-draft.js"
import {getEmptyAppFormDraft} from "./utils/get-empty-app-form-draft.js"
import {appDraftValidators} from "../../../topics/apps/app-draft-validators.js"
import {XioTextInput} from "../../../../xio-components/inputs/xio-text-input.js"

import {AppFormDraft} from "./types/app-form-draft.js"

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
		return html`
			<div class=app-form>
				<slot name=create-app-heading></slot>

				<xio-text-input
					data-form=label
					class=app-label
					initial="${initialValues.label}"
					?disabled=${formDisabled}
					?hide-validation=${!changes}
					.validator=${appDraftValidators.label}
					@valuechange=${handleFormChange}>
						community label
				</xio-text-input>

				<xio-text-input
					data-form=home
					initial="${initialValues.home}"
					?disabled=${formDisabled}
					?hide-validation=${!changes}
					.validator=${appDraftValidators.home}
					@valuechange=${handleFormChange}>
						website homepage
				</xio-text-input>

				<xio-text-input
					textarea
					data-form=additional-origins
					initial="${initialValues.additionalOrigins.join("\n")}"
					?disabled=${formDisabled}
					?hide-validation=${!changes}
					show-validation-when-empty
					.parser=${parseOrigins}
					.validator=${appDraftValidators.additionalOrigins}
					@valuechange=${handleFormChange}>
						additional origins (optional)
				</xio-text-input>

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
