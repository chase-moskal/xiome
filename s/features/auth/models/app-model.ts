
import {Op, ops} from "../../../framework/ops.js"
import {AppDraft} from "../types/apps/app-draft.js"
import {AppDisplay} from "../types/apps/app-display.js"
import {AppModelOptions} from "./types/app/app-model-options.js"
import {autowatcher} from "../../../toolbox/autowatcher/autowatcher.js"

export function makeAppModel({
		appService,
		appEditService,
		manageAdminsService,
		getAccess,
	}: AppModelOptions) {

	const auto = autowatcher()
	const state = auto.state({
		active: false,
		appList: <Op<AppDisplay[]>>ops.none(),
	})
	const actions = auto.actions({
		setActive(active: boolean) {
			state.active = active
		},
		setAppList(op: Op<AppDisplay[]>) {
			state.appList = op
		},
	})

	async function getUserId() {
		const access = await getAccess()
		return access?.user.userId
	}

	async function appListOperation(promise: Promise<AppDisplay[]>) {
		return ops.operation({
			promise,
			setOp: op => actions.setAppList(op),
		})
	}

	async function loadAppList() {
		actions.setActive(true)
		return appListOperation((async() => {
			const userId = await getUserId()
			return userId
				? appService.listApps({ownerUserId: userId})
				: []
		})())
	}

	async function loadingOperation<xResult>({errorReason, promise}: {
			errorReason: string
			promise: Promise<xResult>
		}) {
		let result: xResult
		let error: any
		await appListOperation((async() => {
			try { result = await promise }
			catch (err) { error = err }
			return loadAppList()
		})())
		if (error) throw error
		else return result
	}

	return {
		auto,
		manageAdminsService,
		get appList() {
			return state.appList
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
				promise: (async() => {
					const result = await appService.registerApp({
						appDraft,
						ownerUserId: userId,
					})
					await manageAdminsService.assignPlatformUserAsAdmin({
						appId: result.appId,
						platformUserId: userId,
					})
					return result
				})(),
			})
			return result
		},
		async updateApp(appId: string, appDraft: AppDraft) {
			await loadingOperation({
				errorReason: "failed to update app",
				promise: appEditService.updateApp({
					appId,
					appDraft,
				})
			})
		},
		async deleteApp(appId: string) {
			return loadingOperation({
				errorReason: "failed to delete app",
				promise: appEditService.deleteApp({appId}),
			})
		},
	}
}
