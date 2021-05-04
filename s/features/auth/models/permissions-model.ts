
import {mobxify} from "../../../framework/mobxify.js"
import {loading} from "../../../framework/loading/loading.js"
import {AccessPayload} from "../types/tokens/access-payload.js"
import {PermissionsDisplay} from "../topics/permissions/types/permissions-display.js"
import {PermissionsModelOptions} from "./types/permissions/permissions-model-options.js"
import {appPermissions} from "../../../assembly/backend/permissions2/standard-permissions.js"

export function makePermissionsModel({
		permissionsService,
	}: PermissionsModelOptions) {

	const state = mobxify({
		access: <AccessPayload>undefined,
		active: false,
		permissionsLoading: loading<PermissionsDisplay>(),
	})

	function getUserCanCustomizePermissions() {
		return state.access
				? state.access.permit.privileges.includes(
					appPermissions.privileges["customize permissions"]
				)
				: false
	}

	const actions = mobxify({
		setAccess(access: AccessPayload) {
			state.access = access
		},
		reload: (async() => {
			if (state.active && state.access) {
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
		async initialize() {
			state.active = true
			if (getUserCanCustomizePermissions()) {
				await actions.reload()
			}
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
		initialize: actions.initialize,
		deactivate: actions.deactivate,
		get access() {
			return state.access
		},
		get permissionsLoadingView() {
			return state.permissionsLoading.view
		},
		get userCanCustomizePermissions() {
			return getUserCanCustomizePermissions()
		},
		async accessChange(access: AccessPayload) {
			actions.setAccess(access)
			if (state.active && access?.user) {
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
