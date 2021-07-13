
// import {isPlatform} from "../../../tools/is-platform.js"
// import {PermissionsTables} from "../../types/table-groups/permissions-tables.js"
// import {PlatformConfig} from "../../../../../assembly/backend/types/platform-config.js"
// import {namespaceKeyAppId} from "../../constants/namespace-key-app-id.js"
// import {dbbyHardback} from "../../../../../toolbox/dbby/dbby-hardback.js"
// import {prepareNamespacerForTables} from "../generic/prepare-namespacer-for-tables.js"
// import {transformHardPermissionsToMemoryTables} from "../../../../../assembly/backend/permissions/tables/transform-hard-permissions-to-memory-tables.js"

// export function bakeryForPermissionsTables({config, permissionsTables}: {
// 			config: PlatformConfig
// 			permissionsTables: PermissionsTables
// 		}) {

// 	return async function bakePermissionsTables(
// 				appId: string
// 			): Promise<PermissionsTables> {

// 		const hardPermissionsTables: PermissionsTables = (
// 			await transformHardPermissionsToMemoryTables({
// 				appId,
// 				namespaceKeyAppId,
// 				hardPermissions: (
// 					isPlatform(appId, config)
// 						? config.permissions.platform
// 						: config.permissions.app
// 				),
// 			})
// 		)

// 		const hardbackedPermissionsTables = {
// 			role: dbbyHardback({
// 				frontTable: permissionsTables.role,
// 				backTable: hardPermissionsTables.role,
// 			}),
// 			userHasRole: dbbyHardback({
// 				frontTable: permissionsTables.userHasRole,
// 				backTable: hardPermissionsTables.userHasRole,
// 			}),
// 			privilege: dbbyHardback({
// 				frontTable: permissionsTables.privilege,
// 				backTable: hardPermissionsTables.privilege,
// 			}),
// 			roleHasPrivilege: dbbyHardback({
// 				frontTable: permissionsTables.roleHasPrivilege,
// 				backTable: hardPermissionsTables.roleHasPrivilege,
// 			}),
// 		}

// 		return prepareNamespacerForTables(hardbackedPermissionsTables)(appId)
// 	}
// }
