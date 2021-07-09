
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
					records[app.id_app] = ops.ready(app)
				state.appRecords = ops.replaceValue(op, records)
			},
			setIndividualAppRecord(id_app: string, op: Op<AppDisplay>) {
				if (ops.isLoading(state.appRecords))
					throw new Error("cannot set individual app while apps are loading")
				const apps = ops.value(state.appRecords) ?? {}
				state.appRecords = ops.ready({...apps, [id_app]: op})
			},
			deleteIndividualAppRecord(id_app: string) {
				if (ops.isReady(state.appRecords)) {
					const existingRecords = ops.value(state.appRecords)
					const records: AppRecords = {}
					for (const [key, value] of Object.entries(existingRecords)) {
						if (key !== id_app)
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
		return access?.user?.id_user
	}

	async function loadApps(): Promise<AppDisplay[]> {
		actions.setActive(true)
		const appsPromise = ops.operation({
			promise: (async() => {
				const id_user = await getUserId()
				return id_user
					? appService.listApps({id_ownerUser: id_user})
					: []
			})(),
			setOp: op => actions.setAppRecords(op),
		})
		// actions.setLoadingPromise(appsPromise.then(() => undefined))
		return appsPromise
	}

	async function registerApp(appDraft: AppDraft) {
		const id_user = await getUserId()
		const result = await ops.operation({
			errorReason: "failed to register app",
			promise: (async() => {
				const result = await appService.registerApp({
					appDraft,
					id_ownerUser: id_user,
				})
				await manageAdminsService.assignPlatformUserAsAdmin({
					id_app: result.id_app,
					platformUserId: id_user,
				})
				return result
			})(),
			setOp: op => {
				actions.setAddingNewApp(ops.replaceValue(op, null))
				if (ops.isReady(op)) {
					const newApp: AppDisplay = {...ops.value(op), ...appDraft}
					actions.setIndividualAppRecord(newApp.id_app, ops.ready(newApp))
				}
			},
		})
		return result
	}

	async function updateApp(id_app: string, appDraft: AppDraft) {
		const records = ops.value(getState().appRecords)
		if (!records)
			throw new Error("cannot update app while loading records")
		const existingApp = ops.value(records[id_app])
		if (!existingApp)
			throw new Error("cannot update app not present in records")
		return ops.operation({
			promise: appEditService.updateApp({id_app, appDraft}),
			setOp: op => actions.setIndividualAppRecord(
				id_app,
				ops.replaceValue(op, {...existingApp, ...appDraft})
			),
		})
	}

	function getApp(id_app: string) {
		const records = ops.value(getState().appRecords)
		return records
			? ops.value(records[id_app])
			: undefined
	}

	async function deleteApp(id_app: string) {
		await ops.operation({
			promise: appEditService.deleteApp({id_app}),
			setOp: op => {
				actions.setIndividualAppRecord(
					id_app,
					ops.replaceValue(op, getApp(id_app))
				)
			},
		})
		actions.deleteIndividualAppRecord(id_app)
	}

	return {
		get state() { return getState() },
		getApp(id_app: string) {
			const records = ops.value(getState().appRecords)
			return records
				? ops.value(records[id_app])
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
// 		return access?.user?.id_user
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
// 			const id_user = await getUserId()
// 			return id_user
// 				? appService.listApps({id_ownerUser: id_user})
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
// 			const id_user = await getUserId()
// 			const result = await loadingOperation({
// 				errorReason: "failed to register app",
// 				promise: (async() => {
// 					const result = await appService.registerApp({
// 						appDraft,
// 						id_ownerUser: id_user,
// 					})
// 					await manageAdminsService.assignPlatformUserAsAdmin({
// 						id_app: result.id_app,
// 						platformUserId: id_user,
// 					})
// 					return result
// 				})(),
// 			})
// 			return result
// 		},
// 		async updateApp(id_app: string, appDraft: AppDraft) {
// 			await loadingOperation({
// 				errorReason: "failed to update app",
// 				promise: appEditService.updateApp({
// 					id_app,
// 					appDraft,
// 				})
// 			})
// 		},
// 		async deleteApp(id_app: string) {
// 			return loadingOperation({
// 				errorReason: "failed to delete app",
// 				promise: appEditService.deleteApp({id_app}),
// 			})
// 		},
// 	}
// }
