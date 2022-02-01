
import {snapstate} from "@chasemoskal/snapstate"

import {Op, ops} from "../../../../../framework/ops.js"
import {AccessPayload} from "../../../types/auth-tokens.js"
import {PersonalModelOptions} from "./types/personal-model-options.js"
import {ProfileDraft} from "../routines/personal/types/profile-draft.js"

export function makePersonalModel({
		personalService,
		getAccessOp,
		reauthorize,
	}: PersonalModelOptions) {

	const {readable, writable, track, subscribe} = snapstate({
		accessOp: <Op<AccessPayload>>getAccessOp(),
		submitDraftOp: <Op<void>>ops.ready(undefined),
	})

	return {
		track,
		subscribe,
		readable,
		async saveProfile(profileDraft: ProfileDraft) {
			await ops.operation({
				promise: (async() => {
					const {user: {userId}} = ops.value(readable.accessOp)
					await personalService.setProfile({userId, profileDraft})
					await reauthorize()
				})(),
				errorReason: "error saving profile",
				setOp(op) { writable.submitDraftOp = op },
			})
		},
		updateAccessOp(op: Op<AccessPayload>) {
			writable.accessOp = op
		},
	}
}
