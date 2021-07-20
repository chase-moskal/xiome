
import {AssignerDraft} from "./types/assigner-draft.js"
import {Op, ops} from "../../../../../../../../framework/ops.js"
import {AdminEmailDisplay} from "../../../../types/admin-email-display.js"
import {autowatcher} from "../../../../../../../../toolbox/autowatcher/autowatcher.js"

export function adminManagerStateAndActions() {
	const auto = autowatcher()

	const state = auto.state({
		admins: <Op<AdminEmailDisplay[]>>ops.none(),
		assignerDraft: <AssignerDraft>{
			email: undefined,
		},
	})

	const actions = auto.actions({
		setAdmins(op: Op<AdminEmailDisplay[]>) {
			state.admins = op
		},
		setAssignerDraft(draft: AssignerDraft) {
			state.assignerDraft = draft
		},
	})

	return {
		track: auto.track,
		state,
		actions,
	}
}
