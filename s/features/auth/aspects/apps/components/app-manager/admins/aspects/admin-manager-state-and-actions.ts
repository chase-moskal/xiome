
import {snapstate} from "@chasemoskal/snapstate"

import {AssignerDraft} from "./types/assigner-draft.js"
import {Op, ops} from "../../../../../../../../framework/ops.js"
import {AdminEmailDisplay} from "../../../../types/admin-email-display.js"

export function adminManagerStateAndActions() {

	const state = snapstate({
		admins: <Op<AdminEmailDisplay[]>>ops.none(),
		assignerDraft: <AssignerDraft>{
			email: undefined,
		},
	})

	const actions = {
		setAdmins(op: Op<AdminEmailDisplay[]>) {
			state.writable.admins = op
		},
		setAssignerDraft(draft: AssignerDraft) {
			state.writable.assignerDraft = draft
		},
	}

	return {
		subscribe: state.subscribe,
		state: state.readable,
		actions,
	}
}
