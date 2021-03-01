
import {AccessPayload} from "../types/access-payload.js"
import {onesie} from "../../../toolbox/onesie.js"
import {mobxify} from "../../../framework/mobxify.js"
import {loading} from "../../../framework/loading/loading.js"
import {PermissionsDisplay} from "../topics/permissions/types/permissions-display.js"
import {PermissionsModelOptions} from "./types/permissions/permissions-model-options.js"

export function makePermissionsModel({
		getAccess,
		permissionsService,
	}: PermissionsModelOptions) {

	const state = mobxify({
		active: false,
		permissionsLoading: loading<PermissionsDisplay>(),
	})

	const actions = mobxify({
		reload: onesie(async() => {
			if (await getAccess()) {
				await state.permissionsLoading.actions.setLoadingUntil({
					promise: permissionsService.fetchPermissions(),
					errorReason: "error loading permissions",
				})
			}
		}),
		async load() {
			state.active = true
			actions.reload()
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
