
import {AppFormDraft} from "../types/app-form-draft.js"

export function getEmptyAppFormDraft(): AppFormDraft {
	return {
		home: "",
		label: "",
		additionalOrigins: [],
	}
}
