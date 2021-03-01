
import {addAppIdsToRows} from "./add-app-ids-to-rows.js"
import {concurrent} from "../../../../toolbox/concurrent.js"
import {DbbyRow} from "../../../../toolbox/dbby/dbby-types.js"
import {dbbyMemory} from "../../../../toolbox/dbby/dbby-memory.js"
import {PermissionsTables} from "../../types/permissions-tables"
import {HardPermissions} from "../../types/hard-permissions"

export async function transformHardPermissionsToMemoryTables({
		appId,
		hardPermissions,
		namespaceKeyAppId,
	}: {
		appId: string,
		namespaceKeyAppId: string,
		hardPermissions: HardPermissions,
	}): Promise<PermissionsTables> {

	function augmentWithAppId<Row extends DbbyRow>(rows: Row[]) {
		return addAppIdsToRows(rows, namespaceKeyAppId, appId)
	}

	return concurrent({
		role: dbbyMemory(augmentWithAppId(hardPermissions.roles)),
		userHasRole: dbbyMemory(augmentWithAppId(hardPermissions.userHasRoles)),
		privilege: dbbyMemory(augmentWithAppId(hardPermissions.privileges)),
		roleHasPrivilege: dbbyMemory(augmentWithAppId(hardPermissions.roleHasPrivileges)),
	})
}
