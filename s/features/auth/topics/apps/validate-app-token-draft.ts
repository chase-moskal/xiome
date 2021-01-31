
import {AppTokenDraft} from "../../auth-types.js"
import {appTokenDraftValidators} from "./app-token-draft-validators.js"

export function validateAppTokenDraft(draft: AppTokenDraft) {
	const problems: string[] = [
		...appTokenDraftValidators.label(draft.label),
		...appTokenDraftValidators.origins(draft.origins),
	]
	return problems
}
