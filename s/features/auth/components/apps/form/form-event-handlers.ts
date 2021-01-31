
import {FormState} from "./types/form-state.js"
import {debounce2} from "../../../../../toolbox/debounce2.js"

export function formEventHandlers<xDraft>({
		state, readForm, clearForm, requestUpdate, submit,
	}: {
		state: FormState<xDraft>
		readForm: () => void
		clearForm: () => void
		requestUpdate: () => void
		submit: (draft: xDraft) => Promise<void>
	}) {

	const readFormDebounced = debounce2(500, readForm)

	function handleFormChange() {
		state.problems = []
		state.draft = undefined
		readFormDebounced()
	}

	async function handleSubmitClick() {
		readForm()
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
