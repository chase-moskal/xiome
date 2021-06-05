
import {Op, ops} from "../../../framework/ops.js"
import {AccessPayload} from "../types/tokens/access-payload.js"
import {happystate} from "../../../toolbox/happystate/happystate.js"
import {PermissionsDisplay} from "../topics/permissions/types/permissions-display.js"
import {PermissionsModelOptions} from "./types/permissions/permissions-model-options.js"
import {appPermissions} from "../../../assembly/backend/permissions2/standard-permissions.js"

export function makePermissionsModel({
		permissionsService,
		reauthorize,
	}: PermissionsModelOptions) {

	const {getState, actions, onStateChange} = happystate({
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
			promise: Promise.resolve()
				.then(async() => getUserCanCustomizePermissions()
					? permissionsService.fetchPermissions()
					: undefined),
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

	function reloadAfter<F extends (...args: any) => Promise<any>>(
			func: F
		) {
		return <F>(async(...args: any) => {
			const result = await func(...args)
			await reload()
			await reauthorize()
			return result
		})
	}

	return {
		onStateChange,
		getState,
		initialize,
		getUserCanCustomizePermissions,
		createRole: reloadAfter(permissionsService.createRole),
		deleteRole: reloadAfter(permissionsService.deleteRole),
		assignPrivilege: reloadAfter(permissionsService.assignPrivilege),
		unassignPrivilege: reloadAfter(permissionsService.unassignPrivilege),
		async accessChange(access: AccessPayload) {
			actions.setAccess(access)
			if (access?.user && getState().active)
				await reload()
		},
	}
}
