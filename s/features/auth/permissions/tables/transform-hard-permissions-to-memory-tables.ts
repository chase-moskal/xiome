
import {addAppIdsToRows} from "./add-app-ids-to-rows.js"
import {DbbyRow} from "../../../../toolbox/dbby/dbby-types.js"
import {dbbyMemory} from "../../../../toolbox/dbby/dbby-memory.js"
import {PermissionsTables, HardPermissions} from "../../auth-types.js"

export function transformHardPermissionsToMemoryTables(
			hardPermissions: HardPermissions,
			namespaceKeyAppId: string,
			appId: string,
		): PermissionsTables {

	function augmentWithAppId<Row extends DbbyRow>(rows: Row[]) {
		return addAppIdsToRows(rows, namespaceKeyAppId, appId)
	}

	return {
		role: dbbyMemory({rows: augmentWithAppId(hardPermissions.roles)}),
		userRole: dbbyMemory({rows: augmentWithAppId(hardPermissions.userRoles)}),
		privilege: dbbyMemory({rows: augmentWithAppId(hardPermissions.privileges)}),
		rolePrivilege: dbbyMemory({rows: augmentWithAppId(hardPermissions.rolePrivileges)}),
	}
}
