
import {mobxify} from "../../../framework/mobxify.js"
import {loading} from "../../../framework/loading/loading.js"

import {AppDraft} from "../types/app-draft"
import {AppDisplay} from "../types/apps/app-display.js"
import {AppModelOptions} from "./types/app/app-model-options.js"

export function makeAppModel({
		appService,
		manageAdminsService,
		getAccess,
	}: AppModelOptions) {

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

	async function loadingOperation<xResult>({errorReason, promise}: {
			errorReason: string
			promise: Promise<xResult>
		}) {
		let result: xResult
		let error: any
		await state.appListLoading.actions.setLoadingUntil({
			errorReason,
			promise: (async() => {
				try { result = await promise }
				catch (err) { error = err }
				return loadAppList()
			})(),
		})
		if (error) throw error
		else return result
	}

	return {
		manageAdminsService,
		get appListLoadingView() {
			return state.appListLoading.view
		},
		loadAppList,
		async accessChange() {
			if (state.active)
				await loadAppList()
		},
		async registerApp(appDraft: AppDraft) {
			const userId = await getUserId()
			const result = await loadingOperation({
				errorReason: "failed to register app",
				promise: appService.registerApp({
					appDraft,
					ownerUserId: userId,
				}),
			})
			return result
		},
		async updateApp(appId: string, appDraft: AppDraft) {
			await loadingOperation({
				errorReason: "failed to update app",
				promise: appService.updateApp({
					appId,
					appDraft,
				})
			})
		},
		async deleteApp(appId: string) {
			return loadingOperation({
				errorReason: "failed to delete app",
				promise: appService.deleteApp({appId}),
			})
		},
	}
}
