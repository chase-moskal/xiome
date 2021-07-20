
import {AppDraft} from "../../../../types/app-draft.js"
import {AppFormDraft} from "../types/app-form-draft.js"
import {dedupe} from "../../../../../../../../toolbox/dedupe.js"

export function formDraftToAppDraft(formDraft: AppFormDraft): AppDraft {
	return {
		home: formDraft.home,
		label: formDraft.label,
		origins: dedupe([
			new URL(formDraft.home).origin,
			...formDraft.additionalOrigins,
		])
	}
}
