
import {GetBusiness} from "../../../framework/api/types/get-business.js"
import {happystate} from "../../../toolbox/happystate/happystate.js"
import {onesie} from "../../../toolbox/onesie.js"
import {AccessPayload} from "../../auth/types/tokens/access-payload.js"
import {roleAssignmentParts} from "../api/services/role-assignment-parts.js"
import {searchUsersParts} from "../api/services/search-users-parts.js"

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
		},
		actions: state => ({
			setAccess(access: AccessPayload) {
				state.access = access
			},
		}),
	})

	return {
		onStateChange,
		accessChange: actions.setAccess,
		searchForUsers: searchUsersService.searchForUsers,
	}
}
