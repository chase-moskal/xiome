
import {HardPermissions} from "../../../auth-types.js"

export function getPrivilegeIdsForUser(permissions: HardPermissions, userId: string) {
	const userRoles = permissions.userRoles.filter(userRole => userRole.userId === userId)
	return userRoles.map(userRole => permissions.rolePrivileges
		.filter(row => row.roleId === userRole.roleId)
		.map(row => row.privilegeId)
	).flat()
}
