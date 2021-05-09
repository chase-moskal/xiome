
import {mobxify} from "../../../framework/mobxify.js"
import {loading} from "../../../framework/loading/loading.js"

import {PersonalModelOptions} from "./types/personal/personal-model-options.js"
import {ProfileDraft} from "../topics/personal/types/profile-draft.js"
import {autowatcher} from "../../../toolbox/autowatcher/autowatcher.js"
import {Op, Ops, ops} from "../../../framework/ops.js"

export function makePersonalModel({
		personalService,
		getAccess,
		reauthorize,
	}: PersonalModelOptions) {

	const auto = autowatcher()

	const state = auto.observables({
		submitDraftOp: <Op<void>>ops.ready(undefined)
	})

	const actions = auto.actions({
		setSubmitDraft(op: Op<void>) {
			state.submitDraftOp = op
		},
	})

	// const state = mobxify({
	// 	personalLoading: loading<void>(),
	// })

	// state.personalLoading.actions.setReady()

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

	// return mobxify({
	// 	get submitDraftOp() {}

	// 	get personalLoadingView() {
	// 		return state.personalLoading.view
	// 	},
	// 	async saveProfile(profileDraft: ProfileDraft): Promise<void> {
	// 		await state.personalLoading.actions.setLoadingUntil({
	// 			errorReason: "error saving profile",
	// 			promise: (async() => {
	// 				const {user: {userId}} = await getAccess()
	// 				await personalService.setProfile({userId, profileDraft})
	// 				await reauthorize()
	// 			})()
	// 		})
	// 	},
	// })
}
