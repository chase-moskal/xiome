
import {AppDraft} from "../../../../../../types.js"
import {AppCreatorState} from "../types/app-creator-state.js"
import {debounce2} from "../../../../../../toolbox/debounce2.js"

export function appCreatorEventHandlers({
		state, readForm, clearForm, createApp, requestUpdate
	}: {
		state: AppCreatorState
		readForm: () => void
		clearForm: () => void
		requestUpdate: () => void
		createApp: (draft: AppDraft) => Promise<void>
	}) {

	const readFormDebounced = debounce2(500, readForm)

	function handleFormChange() {
		state.problems = []
		state.appDraft = undefined
		readFormDebounced()
	}

	async function handleCreateClick() {
		readForm()
		state.formDisabled = true
		const draft = state.appDraft
		requestUpdate()
		try {
			await createApp(draft)
			clearForm()
		}
		finally {
			state.formDisabled = false
			requestUpdate()
		}
	}

	return {handleFormChange, handleCreateClick}
}
