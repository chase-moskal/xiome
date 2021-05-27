
import {Op, ops} from "../../../framework/ops.js"
import {AccessPayload} from "../types/tokens/access-payload.js"
import {happystate} from "../../../toolbox/happystate/happystate.js"
import {PermissionsDisplay} from "../topics/permissions/types/permissions-display.js"
import {PermissionsModelOptions} from "./types/permissions/permissions-model-options.js"
import {appPermissions} from "../../../assembly/backend/permissions2/standard-permissions.js"

export function makePermissionsModel({
		permissionsService,
	}: PermissionsModelOptions) {

	const {getState, actions, subscribe} = happystate({
		state: {
			active: <boolean>false,
			access: <AccessPayload>undefined,
			permissionsDisplay: <Op<PermissionsDisplay>>ops.none(),
		},
		actions: state => ({
			setActive(active: boolean) {
				state.active = active
			},
			setPermissionsDisplay(op: Op<PermissionsDisplay>) {
				state.permissionsDisplay = op
			},
			setAccess(access: AccessPayload) {
				state.access = access
			},
		}),
	})

	async function reload() {
		await ops.operation({
			promise: permissionsService.fetchPermissions(),
			setOp: op => actions.setPermissionsDisplay(op),
		})
	}

	function getUserCanCustomizePermissions() {
		const {access} = getState()
		return access?.user
			? access.permit.privileges.includes(
				appPermissions.privileges["customize permissions"]
			)
			: false
	}

	async function initialize() {
		actions.setActive(true)
		if (getUserCanCustomizePermissions())
			await reload()
	}

	function deactivate() {
		actions.setActive(false)
	}

	function reloadAfter<F extends (...args: any) => Promise<any>>(
			func: F
		) {
		return <F>(async(...args: any) => {
			const result = func(...args)
			await reload()
			return result
		})
	}

	return {
		subscribe,
		getState,
		initialize,
		deactivate,
		getUserCanCustomizePermissions,
		createRole: reloadAfter(permissionsService.createRole),
		assignPrivilege: reloadAfter(permissionsService.assignPrivilege),
		unassignPrivilege: reloadAfter(permissionsService.unassignPrivilege),
		async accessChange(access: AccessPayload) {
			actions.setAccess(access)
			if (access?.user && getState().active)
				await reload()
		},
	}
}
