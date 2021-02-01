
import {isPlatform} from "../tools/is-platform.js"
import {dbbyHardcoded} from "../../../toolbox/dbby/dbby-hardcoded.js"
import {prepareConstrainTables} from "../../../toolbox/dbby/dbby-constrain.js"
import {AuthTables, PlatformConfig, PermissionsTables} from "../auth-types.js"

import {transformHardPermissionsToMemoryTables} from "./tables/transform-hard-permissions-to-memory-tables.js"

const namespaceKeyAppId = "_appId"

export function prepareAuthTablesPermissionsAndConstraints({config, authTables}: {
			config: PlatformConfig
			authTables: AuthTables
		}) {

	return function getTables({appId}: {appId: string}): AuthTables {

		const hardPermissions = isPlatform(appId, config)
			? config.permissions.platform
			: config.permissions.app

		const hardTables: PermissionsTables =
			transformHardPermissionsToMemoryTables(
				hardPermissions,
				namespaceKeyAppId,
				appId,
			)

		const hardbackedAuthTables = {
			role: dbbyHardcoded({actualTable: authTables.role, hardTable: hardTables.role}),
			userRole: dbbyHardcoded({actualTable: authTables.userRole, hardTable: hardTables.userRole}),
			privilege: dbbyHardcoded({actualTable: authTables.privilege, hardTable: hardTables.privilege}),
			rolePrivilege: dbbyHardcoded({actualTable: authTables.rolePrivilege, hardTable: hardTables.rolePrivilege}),
		}

		return {
			...authTables,
			...prepareConstrainTables(hardbackedAuthTables)({
				[namespaceKeyAppId]: appId
			}),
		}
	}
}
