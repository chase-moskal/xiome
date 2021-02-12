
import {mobxify} from "../../../framework/mobxify.js"
import {loading} from "../../../framework/loading/loading.js"

import {Profile} from "../auth-types.js"
import {PersonalModelOptions} from "./types/personal/personal-model-options.js"

export function makePersonalModel({
		personalService,
		getAccess,
		reauthorize,
	}: PersonalModelOptions) {

	const state = mobxify({
		personalLoading: loading<void>(),
	})

	state.personalLoading.actions.setReady()

	return mobxify({
		get personalLoadingView() {
			return state.personalLoading.view
		},
		async saveProfile(draft: Profile): Promise<void> {
			await state.personalLoading.actions.setLoadingUntil({
				errorReason: "error saving profile",
				promise: (async() => {
					const {user} = await getAccess()
					await personalService.setProfile({
						userId: user.userId,
						profile: draft,
					})
					await reauthorize()
				})()
			})
		},
	})
}
