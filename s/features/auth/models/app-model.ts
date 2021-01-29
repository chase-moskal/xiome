
import {mobxify} from "../../../framework/mobxify.js"
import {loading} from "../../../toolbox/loading/loading.js"

import {AppDraft} from "../auth-types.js"
import {AppDisplay} from "../types/apps/app-display.js"
import {AppModelOptions} from "./types/app/app-model-options.js"

export function makeAppModel({appService, getAccess}: AppModelOptions) {

	const state = mobxify({
		appListLoading: loading<AppDisplay[]>(),
	})

	async function getUserId() {
		const access = await getAccess()
		if (!access) throw new Error("must be logged in")
		return access.user.userId
	}

	return mobxify({
		get appListLoadingView() {
			return state.appListLoading.view
		},
		async loadAppList() {
			await state.appListLoading.actions.setLoadingUntil({
				errorReason: "failed to load app list",
				promise: getUserId()
					.then(userId => appService.listApps({ownerUserId: userId})),
			})
		},
		async registerApp(appDraft: AppDraft) {
			if (!appDraft) throw new Error("app draft missing")
			const userId = await getUserId()
			await appService.registerApp({
				appDraft,
				ownerUserId: userId,
			})
			await this.loadAppList()
		},
	})
}
