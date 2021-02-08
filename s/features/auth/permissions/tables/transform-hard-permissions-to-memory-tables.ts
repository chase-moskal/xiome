
import {addAppIdsToRows} from "./add-app-ids-to-rows.js"
import {DbbyRow} from "../../../../toolbox/dbby/dbby-types.js"
import {dbbyMemory} from "../../../../toolbox/dbby/dbby-memory.js"
import {PermissionsTables, HardPermissions} from "../../auth-types.js"

export function transformHardPermissionsToMemoryTables({
		appId,
		hardPermissions,
		namespaceKeyAppId,
	}: {
		hardPermissions: HardPermissions,
		namespaceKeyAppId: string,
		appId: string,
	}): PermissionsTables {

	function augmentWithAppId<Row extends DbbyRow>(rows: Row[]) {
		return addAppIdsToRows(rows, namespaceKeyAppId, appId)
	}

	return {
		role: dbbyMemory({rows: augmentWithAppId(hardPermissions.roles)}),
		userHasRole: dbbyMemory({rows: augmentWithAppId(hardPermissions.userHasRoles)}),
		privilege: dbbyMemory({rows: augmentWithAppId(hardPermissions.privileges)}),
		roleHasPrivilege: dbbyMemory({rows: augmentWithAppId(hardPermissions.roleHasPrivileges)}),
	}
}
