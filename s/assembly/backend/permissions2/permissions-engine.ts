
import {PermissionsTables} from "../../../features/auth/tables/types/table-groups/permissions-tables.js"

export function permissionsEngine({appId, permissionsTables}: {
		appId: string
		permissionsTables: PermissionsTables
	}) {

	async function getAnonymousPrivileges() {}
	async function getUserPrivileges(userId: string) {}

	async function getPermissionsSummary() {}

	async function createRole() {}
	async function deleteRole() {}

	async function createPrivilege() {}
	async function deletePrivilege() {}

	async function assignPrivilege() {}
	async function unassignPrivilege() {}

	async function grantRole() {}
	async function revokeRole() {}
}
