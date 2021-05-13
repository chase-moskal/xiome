
import {Op, ops} from "../../../framework/ops.js"
import {AccessPayload} from "../types/tokens/access-payload.js"
import {autowatcher} from "../../../toolbox/autowatcher/autowatcher.js"
import {PermissionsDisplay} from "../topics/permissions/types/permissions-display.js"
import {PermissionsModelOptions} from "./types/permissions/permissions-model-options.js"
import {appPermissions} from "../../../assembly/backend/permissions2/standard-permissions.js"

export function makePermissionsModel({
		permissionsService,
	}: PermissionsModelOptions) {

	const auto = autowatcher()
	const state = auto.state({
		active: false,
		access: <AccessPayload>undefined,
		permissionsDisplay: <Op<PermissionsDisplay>>undefined,
	})
	const actions = auto.actions({
		setPermissionsDisplay(op: Op<PermissionsDisplay>) {
			state.permissionsDisplay = op
		},
		setAccess(access: AccessPayload) {
			state.access = access
		},
		async reload() {
			if (state.active && state.access) {
				try {
					await ops.operation({
						promise: permissionsService.fetchPermissions(),
						setOp: op => actions.setPermissionsDisplay(op),
					})
				}
				catch (e) {
					console.log(e)
				}
			}
		},
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
			actions.setPermissionsDisplay(ops.loading())
			return <xAction>async function(...args: any[]) {
				const result = await action(...args)
				await actions.reload()
				return result
			}
		},
	})

	function getUserCanCustomizePermissions() {
		return state.access
				? state.access.permit.privileges.includes(
					appPermissions.privileges["customize permissions"]
				)
				: false
	}

	return {
		track: auto.track,
		initialize: actions.initialize,
		deactivate: actions.deactivate,
		get access() {
			return state.access
		},
		get permissionsDisplay() {
			return state.permissionsDisplay
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
