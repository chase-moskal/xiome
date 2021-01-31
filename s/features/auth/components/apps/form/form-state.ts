
import {FormState} from "./types/form-state.js"

export function formState<xDraft>(): FormState<xDraft> {
	return {
		problems: [],
		draft: undefined,
		formDisabled: false,
	}
}
