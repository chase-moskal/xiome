
import {AppDraft} from "../../types/AppDraft"
import {appDraftValidators} from "./app-draft-validators.js"

export function validateAppDraft(appDraft: AppDraft) {
	const problems: string[] = [
		...appDraftValidators.label(appDraft.label),
		...appDraftValidators.home(appDraft.home),
		...appDraftValidators.origins(appDraft.origins),
	]
	return problems
}
