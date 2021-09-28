
import {Op, ops} from "../../../../../framework/ops.js"
import {AccessPayload} from "../../../types/auth-tokens.js"
import {madstate} from "../../../../../toolbox/madstate/madstate.js"
import {PermissionsModelOptions} from "./types/permissions-model-options.js"
import {PermissionsDisplay} from "../../users/routines/permissions/types/permissions-display.js"
import {appPermissions} from "../../../../../assembly/backend/permissions/standard-permissions.js"

export function makePermissionsModel({
		permissionsService,
		reauthorize,
	}: PermissionsModelOptions) {

	const {readable, writable, subscribe, track} = madstate({
		active: <boolean>false,
		accessOp: <Op<AccessPayload>>ops.none(),
		permissionsDisplay: <Op<PermissionsDisplay>>ops.none(),
	})

	function getAccess() {
		return ops.value(readable.accessOp)
	}

	async function reload() {
		await ops.operation({
			promise: Promise.resolve()
				.then(async() => getUserCanCustomizePermissions()
					? permissionsService.fetchPermissions()
					: undefined),
			setOp: op => writable.permissionsDisplay = op,
		})
	}

	function getUserCanCustomizePermissions() {
		const access = getAccess()
		return access?.user
			? access.permit.privileges.includes(
				appPermissions.privileges["customize permissions"]
			)
			: false
	}

	async function initialize() {
		writable.active = true
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
		readable,
		subscribe,
		track,
		getAccess,
		initialize,
		getUserCanCustomizePermissions,
		createRole: reloadAfter(permissionsService.createRole),
		deleteRole: reloadAfter(permissionsService.deleteRole),
		assignPrivilege: reloadAfter(permissionsService.assignPrivilege),
		unassignPrivilege: reloadAfter(permissionsService.unassignPrivilege),
		async updateAccessOp(op: Op<AccessPayload>) {
			writable.accessOp = op
			const access = getAccess()
			if (access?.user && writable.active)
				await reload()
		},
	}
}
