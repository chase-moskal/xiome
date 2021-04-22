
import {AccessPayload} from "../types/tokens/access-payload.js"
import {onesie} from "../../../toolbox/onesie.js"
import {mobxify} from "../../../framework/mobxify.js"
import {loading} from "../../../framework/loading/loading.js"
import {PermissionsDisplay} from "../topics/permissions/types/permissions-display.js"
import {PermissionsModelOptions} from "./types/permissions/permissions-model-options.js"
import {nap} from "../../../toolbox/nap.js"

export function makePermissionsModel({
		permissionsService,
	}: PermissionsModelOptions) {

	const state = mobxify({
		access: <AccessPayload>undefined,
		active: false,
		permissionsLoading: loading<PermissionsDisplay>(),
	})

	const actions = mobxify({
		setAccess(access: AccessPayload) {
			state.access = access
		},
		reload: onesie(async() => {
			if (state.access) {
				try {
					await state.permissionsLoading.actions.setLoadingUntil({
						promise: permissionsService.fetchPermissions(),
						errorReason: "error loading permissions",
					})
				}
				catch (e) {
					console.log(e)
				}
			}
		}),
		async load() {
			state.active = true
			await actions.reload()
		},
		deactivate() {
			state.active = false
		},
		reloadAfter<xAction extends (...args: any[]) => Promise<void>>(action: xAction) {
			state.permissionsLoading.actions.setLoading()
			return <xAction>async function(...args: any[]) {
				const result = await action(...args)
				await actions.reload()
				return result
			}
		},
	})

	return {
		load: actions.load,
		deactivate: actions.deactivate,
		get permissionsLoadingView() {
			return state.permissionsLoading.view
		},
		async accessChange(access: AccessPayload) {
			actions.setAccess(access)
			if (state.active && access) {
				await actions.reload()
			}
		},
		createRole: actions.reloadAfter(async(label: string) => {
			await permissionsService.createRole({label})
		}),
		assignPrivilege: actions.reloadAfter(async({roleId, privilegeId}: {
				roleId: string
				privilegeId: string
			}) => {
			await permissionsService.assignPrivilege({
				roleId,
				privilegeId,
			})
		}),
		unassignPrivilege: actions.reloadAfter(async({roleId, privilegeId}: {
				roleId: string
				privilegeId: string
			}) => {
			await permissionsService.unassignPrivilege({
				roleId,
				privilegeId,
			})
		}),
	}
}
