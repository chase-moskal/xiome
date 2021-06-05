
import {Op, ops} from "../../../framework/ops.js"
import {happystate} from "../../../toolbox/happystate/happystate.js"
import {searchUsersParts} from "../api/services/search-users-parts.js"
import {AccessPayload} from "../../auth/types/tokens/access-payload.js"
import {GetBusiness} from "../../../framework/api/types/get-business.js"
import {roleAssignmentParts} from "../api/services/role-assignment-parts.js"
import {PermissionsDisplay} from "../../auth/topics/permissions/types/permissions-display.js"

export function makeAdministrativeModel({
		searchUsersService,
		roleAssignmentService,
	}: {
		searchUsersService: GetBusiness<typeof searchUsersParts>
		roleAssignmentService: GetBusiness<typeof roleAssignmentParts>
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

	async function loadPermissions() {
		await ops.operation({
			promise: roleAssignmentService.fetchPermissions(),
			setOp: actions.setPermissionsOp,
		})
	}

	return {
		getState,
		onStateChange,
		loadPermissions,
		accessChange: (access: AccessPayload) => {
			actions.setAccess(access)
			loadPermissions()
		},
		searchForUsers: searchUsersService.searchForUsers,
	}
}
