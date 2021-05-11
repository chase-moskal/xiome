
import {Op, ops} from "../../../framework/ops.js"
import {ProfileDraft} from "../topics/personal/types/profile-draft.js"
import {autowatcher} from "../../../toolbox/autowatcher/autowatcher.js"
import {PersonalModelOptions} from "./types/personal/personal-model-options.js"

export function makePersonalModel({
		personalService,
		getAccess,
		reauthorize,
	}: PersonalModelOptions) {

	const auto = autowatcher()

	const state = auto.state({
		submitDraftOp: <Op<void>>ops.ready(undefined)
	})

	const actions = auto.actions({
		setSubmitDraft(op: Op<void>) {
			state.submitDraftOp = op
		},
	})

	return {
		get submitDraftOp() {
			return state.submitDraftOp
		},
		async saveProfile(profileDraft: ProfileDraft) {
			await ops.operation({
				promise: (async() => {
					const {user: {userId}} = await getAccess()
					await personalService.setProfile({userId, profileDraft})
					await reauthorize()
				})(),
				errorReason: "error saving profile",
				setOp(op) {
					actions.setSubmitDraft(op)
				},
			})
		}
	}
}
