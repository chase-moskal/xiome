
import {AppDraft} from "../types/app-draft.js"
import {schema} from "../../../../../toolbox/darkvalley.js"
import {appDraftValidators} from "./app-draft-validators.js"

const validator = schema<AppDraft>({
	home: appDraftValidators.home,
	label: appDraftValidators.label,
	origins: appDraftValidators.origins,
})

export function validateAppDraft(appDraft: AppDraft) {
	return validator(appDraft)
}
