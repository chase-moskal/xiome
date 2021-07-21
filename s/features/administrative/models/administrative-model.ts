
import {Op, ops} from "../../../framework/ops.js"
import {Service} from "../../../types/service.js"
import {AccessPayload} from "../../auth2/types/auth-tokens.js"
import {happystate} from "../../../toolbox/happystate/happystate.js"
import {makeRoleAssignmentService} from "../api/services/role-assignment-service.js"
import {appPermissions} from "../../../assembly/backend/permissions2/standard-permissions.js"
import {makeAllowanceChecker} from "../../../assembly/backend/permissions2/tools/make-allowance-checker.js"
import {PermissionsDisplay} from "../../auth2/aspects/users/routines/permissions/types/permissions-display.js"

export function makeAdministrativeModel({
		roleAssignmentService,
		reauthorize,
	}: {
		roleAssignmentService: Service<typeof makeRoleAssignmentService>
		reauthorize: () => Promise<void>
	}) {

	const {actions, getState, onStateChange} = happystate({
		state: {
			access: <AccessPayload>undefined,
			permissionsOp: <Op<PermissionsDisplay>>ops.none(),
		},
		actions: state => ({
			setAccess(access: AccessPayload) {
				state.access = access
			},
			setPermissionsOp(op: Op<PermissionsDisplay>) {
				state.permissionsOp = op
			},
		}),
	})

	let initializedInDom = false

	function allowanceChecker() {
		return makeAllowanceChecker(getState().access, appPermissions.privileges)
	}

	async function loadPermissions() {
		if (initializedInDom && allowanceChecker()("administrate user roles"))
			await ops.operation({
				promise: roleAssignmentService.fetchPermissions(),
				setOp: actions.setPermissionsOp,
			})
	}

	async function initialize() {
		initializedInDom = true
		await loadPermissions()
	}

	return {
		getState,
		onStateChange,
		initialize,
		get isAllowed() {
			return allowanceChecker()
		},
		accessChange: (access: AccessPayload) => {
			actions.setAccess(access)
			loadPermissions()
		},
		reauthorize,
		searchUsers: roleAssignmentService.searchUsers,
		assignRoleToUser: roleAssignmentService.assignRoleToUser,
		revokeRoleFromUser: roleAssignmentService.revokeRoleFromUser,
	}
}
