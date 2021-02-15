
import {AssignerDraft} from "./types/assigner-draft.js"
import {mobxify} from "../../../../../../framework/mobxify.js"
import {loading} from "../../../../../../framework/loading/loading.js"
import {AdminEmailDisplay} from "../../../../types/manage-admins/admin-email-display.js"

export function adminManagerStateAndActions() {
	const adminsLoading = loading<AdminEmailDisplay[]>()

	const state = mobxify({
		adminsLoadingView: adminsLoading.view,
		assignerDraft: <AssignerDraft>{
			email: undefined,
		},
	})

	const actions = mobxify({
		adminsLoadingActions: adminsLoading.actions,
		setAssignerDraft({email}: AssignerDraft) {
			state.assignerDraft = {email}
		},
	})

	return {
		state,
		actions,
	}
}
