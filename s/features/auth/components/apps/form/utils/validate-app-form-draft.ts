
import {AppFormDraft} from "../types/app-form-draft.js"
import {appDraftValidators} from "../../../../topics/apps/app-draft-validators.js"

export function validateAppFormDraft(formDraft: AppFormDraft) {
	const problems: string[] = [
		...appDraftValidators.label(formDraft.label),
		...appDraftValidators.home(formDraft.home),
		...appDraftValidators.additionalOrigins(formDraft.additionalOrigins),
	]
	return problems
}
