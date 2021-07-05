
import {Op, ops} from "../../../framework/ops.js"
import {AppDraft} from "../types/apps/app-draft.js"
import {AppRecords} from "./types/app/app-records.js"
import {AppDisplay} from "../types/apps/app-display.js"
import {AppModelOptions} from "./types/app/app-model-options.js"
import {happystate} from "../../../toolbox/happystate/happystate.js"

export function makeAppModel({
		appService,
		appEditService,
		manageAdminsService,
		getAccess,
	}: AppModelOptions) {

	const {actions, getState, onStateChange} = happystate({
		state: {
			active: false,
			appRecords: <Op<AppRecords>>ops.none(),
			addingNewApp: <Op<null>>ops.none(),
			// loadingPromise: <Promise<void>>Promise.resolve(),
		},
		actions: state => ({
			setActive(active) {
				state.active = active
			},
			setAddingNewApp(op: Op<null>) {
				state.addingNewApp = op
			},
			// setLoadingPromise(promise: Promise<void>) {
			// 	state.loadingPromise = promise
			// },
			setAppRecords(op: Op<AppDisplay[]>) {
				const appList = ops.value(op) ?? []
				let records: AppRecords = {}
				for (const app of appList)
					records[app.appId] = ops.ready(app)
				state.appRecords = ops.replaceValue(op, records)
			},
			setIndividualAppRecord(appId: string, op: Op<AppDisplay>) {
				if (ops.isLoading(state.appRecords))
					throw new Error("cannot set individual app while apps are loading")
				const apps = ops.value(state.appRecords) ?? {}
				state.appRecords = ops.ready({...apps, [appId]: op})
			},
			deleteIndividualAppRecord(appId: string) {
				if (ops.isReady(state.appRecords)) {
					const existingRecords = ops.value(state.appRecords)
					const records: AppRecords = {}
					for (const [key, value] of Object.entries(existingRecords)) {
						if (key !== appId)
							records[key] = value
					}
					state.appRecords = ops.ready(records)
				}
				else
					throw new Error("cannot delete individual app while apps are loading")
			},
		}),
	})

	async function getUserId() {
		const access = await getAccess()
		return access?.user?.userId
	}

	async function loadApps(): Promise<AppDisplay[]> {
		actions.setActive(true)
		const appsPromise = ops.operation({
			promise: (async() => {
				const userId = await getUserId()
				return userId
					? appService.listApps({ownerUserId: userId})
					: []
			})(),
			setOp: op => actions.setAppRecords(op),
		})
		// actions.setLoadingPromise(appsPromise.then(() => undefined))
		return appsPromise
	}

	async function registerApp(appDraft: AppDraft) {
		const userId = await getUserId()
		const result = await ops.operation({
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
			setOp: op => {
				actions.setAddingNewApp(ops.replaceValue(op, null))
				if (ops.isReady(op)) {
					const newApp: AppDisplay = {...ops.value(op), ...appDraft}
					actions.setIndividualAppRecord(newApp.appId, ops.ready(newApp))
				}
			},
		})
		return result
	}

	async function updateApp(appId: string, appDraft: AppDraft) {
		const records = ops.value(getState().appRecords)
		if (!records)
			throw new Error("cannot update app while loading records")
		const existingApp = ops.value(records[appId])
		if (!existingApp)
			throw new Error("cannot update app not present in records")
		return ops.operation({
			promise: appEditService.updateApp({appId, appDraft}),
			setOp: op => actions.setIndividualAppRecord(
				appId,
				ops.replaceValue(op, {...existingApp, ...appDraft})
			),
		})
	}

	function getApp(appId: string) {
		const records = ops.value(getState().appRecords)
		return records
			? ops.value(records[appId])
			: undefined
	}

	async function deleteApp(appId: string) {
		await ops.operation({
			promise: appEditService.deleteApp({appId}),
			setOp: op => {
				actions.setIndividualAppRecord(
					appId,
					ops.replaceValue(op, getApp(appId))
				)
			},
		})
		actions.deleteIndividualAppRecord(appId)
	}

	return {
		get state() { return getState() },
		getApp(appId: string) {
			const records = ops.value(getState().appRecords)
			return records
				? ops.value(records[appId])
				: undefined
		},
		onStateChange,
		loadApps,
		deleteApp,
		updateApp,
		registerApp,
		manageAdminsService,
		async accessChange() {
			if (getState().active)
				await loadApps()
		},
	}
}

// export function makeAppModel({
// 		appService,
// 		appEditService,
// 		manageAdminsService,
// 		getAccess,
// 	}: AppModelOptions) {

// 	const auto = autowatcher()
// 	const state = auto.state({
// 		active: false,
// 		appList: <Op<AppDisplay[]>>ops.none(),
// 	})
// 	const actions = auto.actions({
// 		setActive(active: boolean) {
// 			state.active = active
// 		},
// 		setAppList(op: Op<AppDisplay[]>) {
// 			state.appList = op
// 		},
// 	})

// 	async function getUserId() {
// 		const access = await getAccess()
// 		return access?.user?.userId
// 	}

// 	async function appListOperation(promise: Promise<AppDisplay[]>) {
// 		return ops.operation({
// 			promise,
// 			setOp: op => actions.setAppList(op),
// 		})
// 	}

// 	async function loadAppList() {
// 		actions.setActive(true)
// 		return appListOperation((async() => {
// 			const userId = await getUserId()
// 			return userId
// 				? appService.listApps({ownerUserId: userId})
// 				: []
// 		})())
// 	}

// 	async function loadingOperation<xResult>({errorReason, promise}: {
// 			errorReason: string
// 			promise: Promise<xResult>
// 		}) {
// 		let result: xResult
// 		let error: any
// 		await appListOperation((async() => {
// 			try { result = await promise }
// 			catch (err) { error = err }
// 			return loadAppList()
// 		})())
// 		if (error) throw error
// 		else return result
// 	}

// 	return {
// 		track: auto.track,
// 		manageAdminsService,
// 		get appList() {
// 			return state.appList
// 		},
// 		loadAppList,
// 		async accessChange() {
// 			if (state.active)
// 				await loadAppList()
// 		},
// 		async registerApp(appDraft: AppDraft) {
// 			const userId = await getUserId()
// 			const result = await loadingOperation({
// 				errorReason: "failed to register app",
// 				promise: (async() => {
// 					const result = await appService.registerApp({
// 						appDraft,
// 						ownerUserId: userId,
// 					})
// 					await manageAdminsService.assignPlatformUserAsAdmin({
// 						appId: result.appId,
// 						platformUserId: userId,
// 					})
// 					return result
// 				})(),
// 			})
// 			return result
// 		},
// 		async updateApp(appId: string, appDraft: AppDraft) {
// 			await loadingOperation({
// 				errorReason: "failed to update app",
// 				promise: appEditService.updateApp({
// 					appId,
// 					appDraft,
// 				})
// 			})
// 		},
// 		async deleteApp(appId: string) {
// 			return loadingOperation({
// 				errorReason: "failed to delete app",
// 				promise: appEditService.deleteApp({appId}),
// 			})
// 		},
// 	}
// }
