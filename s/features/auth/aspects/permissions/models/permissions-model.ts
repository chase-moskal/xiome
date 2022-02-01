
import {snapstate} from "@chasemoskal/snapstate"

import {Op, ops} from "../../../../../framework/ops.js"
import {AccessPayload} from "../../../types/auth-tokens.js"
import {PermissionsModelOptions} from "./types/permissions-model-options.js"
import {PrivilegeDisplay} from "../../users/routines/permissions/types/privilege-display.js"
import {PermissionsDisplay} from "../../users/routines/permissions/types/permissions-display.js"
import {appPermissions} from "../../../../../assembly/backend/permissions/standard-permissions.js"

export function makePermissionsModel({
		permissionsService,
		reauthorize,
	}: PermissionsModelOptions) {

	const {readable, writable, subscribe, track} = snapstate({
		active: <boolean>false,
		accessOp: <Op<AccessPayload>>ops.none(),
		permissionsDisplay: <Op<PermissionsDisplay>>ops.none(),
	})

	function getAccess() {
		return ops.value(readable.accessOp)
	}

	function sortPermissions(permissions: PermissionsDisplay): PermissionsDisplay {
		const softPrivileges: PrivilegeDisplay[] = []
		const hardPrivileges: PrivilegeDisplay[] = []

		for (const privilege of permissions.privileges) {
			if (privilege.hard) hardPrivileges.push(privilege)
			else softPrivileges.push(privilege)
		}

		softPrivileges.sort(
			(a: {time: number}, b: {time: number}) =>
				b.time - a.time
		)

		return {
			...permissions,
			privileges: [...softPrivileges, ...hardPrivileges],
		}
	}

	async function reload() {
		await ops.operation({
			promise: Promise.resolve()
				.then(async() => getUserCanCustomizePermissions()
					? permissionsService.fetchPermissions().then(sortPermissions)
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
		deletePrivilege: reloadAfter(permissionsService.deletePrivilege),
		createPrivilege: reloadAfter(permissionsService.createPrivilege),
		async updateAccessOp(op: Op<AccessPayload>) {
			writable.accessOp = op
			const access = getAccess()
			if (access?.user && writable.active)
				await reload()
		},
	}
}
