
import {mobxify} from "../../../framework/mobxify.js"
import {loading} from "../../../framework/loading/loading.js"

import {AppDraft} from "../auth-types.js"
import {AppDisplay} from "../types/apps/app-display.js"
import {AppModelOptions} from "./types/app/app-model-options.js"

export function makeAppModel({appService, getAccess}: AppModelOptions) {

	const state = mobxify({
		active: false,
		appListLoading: loading<AppDisplay[]>(),
		setActive(active: boolean) {
			state.active = active
		},
	})

	async function getUserId() {
		const access = await getAccess()
		return access?.user.userId
	}

	async function loadAppList() {
		state.setActive(true)
		return await state.appListLoading.actions.setLoadingUntil({
			errorReason: "failed to load app list",
			promise: getUserId()
				.then(userId => userId
					? appService.listApps({ownerUserId: userId})
					: []),
		})
	}

	return mobxify({
		get appListLoadingView() {
			return state.appListLoading.view
		},
		loadAppList,
		async accessChange() {
			if (state.active)
				await loadAppList()
		},
		async registerApp(appDraft: AppDraft) {
			if (!appDraft) throw new Error("app draft missing")
			const userId = await getUserId()
			await appService.registerApp({
				appDraft,
				ownerUserId: userId,
			})
			await loadAppList()
		},
		async deleteApp(appId: string) {
			await state.appListLoading.actions.setLoadingUntil({
				errorReason: "failed to delete app",
				promise: (async() => {
					await appService.deleteApp({appId})
					return await loadAppList()
				})(),
			})
		},
	})
}
