
import {snapstate} from "@chasemoskal/snapstate"

import {AppDraft} from "../types/app-draft.js"
import {AppRecords} from "./types/app-records.js"
import {AppDisplay} from "../types/app-display.js"
import {Op, ops} from "../../../../../framework/ops.js"
import {AccessPayload} from "../../../types/auth-tokens.js"
import {AppModelOptions} from "./types/apps-model-options.js"

export function makeAppsModel({
		appService,
		appEditService,
		getValidAccess,
	}: AppModelOptions) {

	const {readable, writable, subscribe} = snapstate({
		active: false,
		appRecords: <Op<AppRecords>>ops.none(),
		addingNewApp: <Op<null>>ops.none(),
	})

	const actions = {
		setAppRecords(op: Op<AppDisplay[]>) {
			const appList = ops.value(op) ?? []
			let records: AppRecords = {}
			for (const app of appList)
				records[app.appId] = ops.ready(app)
			writable.appRecords = ops.replaceValue(op, records)
		},
		setIndividualAppRecord(appId: string, op: Op<AppDisplay>) {
			if (ops.isLoading(writable.appRecords))
				throw new Error("cannot set individual app while apps are loading")
			const apps = ops.value(writable.appRecords) ?? {}
			writable.appRecords = ops.ready({...apps, [appId]: op})
		},
		deleteIndividualAppRecord(appId: string) {
			if (ops.isReady(writable.appRecords)) {
				const existingRecords = ops.value(writable.appRecords)
				const records: AppRecords = {}
				for (const [key, value] of Object.entries(existingRecords)) {
					if (key !== appId)
						records[key] = value
				}
				writable.appRecords = ops.ready(records)
			}
			else
				throw new Error("cannot delete individual app while apps are loading")
		},
	}

	async function getUserId() {
		const access = await getValidAccess()
		return access?.user?.userId
	}

	async function loadApps(): Promise<AppDisplay[]> {
		writable.active = true
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
				await appEditService.assignPlatformUserAsAdmin({
					appId: result.appId,
					platformUserId: userId,
				})
				return result
			})(),
			setOp: op => {
				writable.addingNewApp = ops.replaceValue(op, null)
				if (ops.isReady(op)) {
					const newApp: AppDisplay = {...ops.value(op), ...appDraft}
					actions.setIndividualAppRecord(newApp.appId, ops.ready(newApp))
				}
			},
		})
		return result
	}

	async function updateApp(appId: string, appDraft: AppDraft) {
		const records = ops.value(writable.appRecords)
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
		const records = ops.value(writable.appRecords)
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
		state: readable,
		subscribe,
		appEditService,
		getApp,
		loadApps,
		deleteApp,
		updateApp,
		registerApp,
		async updateAccessOp(op: Op<AccessPayload>) {
			if (readable.active)
				await loadApps()
		},
	}
}
