
import {FormState} from "./types/form-state.js"
import {debounce2} from "../../../../../toolbox/debounce2.js"

export function formEventHandlers<xDraft>({
		state, readAndValidateForm, clearForm, requestUpdate, submit,
	}: {
		state: FormState<xDraft>
		clearForm: () => void
		requestUpdate: () => void
		readAndValidateForm: () => void
		submit: (draft: xDraft) => Promise<void>
	}) {

	const readFormDebounced = debounce2(200, readAndValidateForm)

	function handleFormChange() {
		state.problems = []
		state.draft = undefined
		readFormDebounced()
	}

	async function handleSubmitClick() {
		readAndValidateForm()
		state.formDisabled = true
		const draft = state.draft
		requestUpdate()
		try {
			await submit(draft)
			clearForm()
		}
		finally {
			state.formDisabled = false
			requestUpdate()
		}
	}

	return {handleFormChange, handleSubmitClick}
}
