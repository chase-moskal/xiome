
import {snapstate} from "@chasemoskal/snapstate"

import {Op, ops} from "../../../framework/ops.js"
import {Service} from "../../../types/service.js"
import {AccessPayload} from "../../auth/types/auth-tokens.js"
import {makeRoleAssignmentService} from "../api/services/role-assignment-service.js"
import {appPermissions} from "../../../assembly/backend/permissions/standard-permissions.js"
import {makeAllowanceChecker} from "../../../assembly/backend/permissions/tools/make-allowance-checker.js"
import {PermissionsDisplay} from "../../auth/aspects/users/routines/permissions/types/permissions-display.js"

export function makeAdministrativeModel({
		roleAssignmentService,
		reauthorize,
	}: {
		roleAssignmentService: Service<typeof makeRoleAssignmentService>
		reauthorize: () => Promise<void>
	}) {

	const state = snapstate({
		accessOp: ops.none() as Op<AccessPayload>,
		permissionsOp: ops.none() as Op<PermissionsDisplay>,
	})

	function getAccess() {
		return ops.value(state.readable.accessOp)
	}

	let initializedInDom = false

	function allowanceChecker() {
		return makeAllowanceChecker(getAccess(), appPermissions.privileges)
	}

	async function loadPermissions() {
		if (initializedInDom && allowanceChecker()("administrate user roles"))
			await ops.operation({
				promise: roleAssignmentService.fetchPermissions(),
				setOp: op => state.writable.permissionsOp = op,
			})
	}

	async function initialize() {
		initializedInDom = true
		await loadPermissions()
	}

	return {
		state: state.readable,
		subscribe: state.subscribe,
		getAccess,
		initialize,
		get isAllowed() {
			return allowanceChecker()
		},
		reauthorize,
		searchUsers: roleAssignmentService.searchUsers,
		assignRoleToUser: roleAssignmentService.assignRoleToUser,
		revokeRoleFromUser: roleAssignmentService.revokeRoleFromUser,
		async updateAccessOp(op: Op<AccessPayload>) {
			state.writable.accessOp = op
			loadPermissions()
		},
	}
}
