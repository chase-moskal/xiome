
import {isPlatform} from "../tools/is-platform.js"
import {dbbyMemory} from "../../../toolbox/dbby/dbby-memory.js"
import {dbbyHardcoded} from "../../../toolbox/dbby/dbby-hardcoded.js"
import {prepareConstrainTables} from "../../../toolbox/dbby/dbby-constrain.js"
import {originsToDatabase} from "../topics/origins/origins-to-database.js"
import {AuthTables, PlatformConfig, PermissionsTables, AppRow, AuthTablesGlobal} from "../auth-types.js"
import {transformHardPermissionsToMemoryTables} from "../permissions/tables/transform-hard-permissions-to-memory-tables.js"

import {namespaceKeyAppId} from "./namespace-key-app-id.js"

export function bakeAuthTables({config, authTables}: {
			config: PlatformConfig
			authTables: AuthTables
		}) {

	return function getTables({appId}: {appId: string}): AuthTables {
		const hardTables: PermissionsTables = (
			transformHardPermissionsToMemoryTables({
				appId,
				namespaceKeyAppId,
				hardPermissions: (
					isPlatform(appId, config)
						? config.permissions.platform
						: config.permissions.app
				),
			})
		)

		const platformApp = config.platform.appDetails
		const hardAppTable = dbbyMemory<AppRow>({
			rows: [{
				appId: platformApp.appId,
				home: platformApp.home,
				label: platformApp.label,
				origins: originsToDatabase(platformApp.origins),
				archived: false,
			}],
		})

		const permissionsTables = {
			role: dbbyHardcoded({
				actualTable: authTables.role,
				hardTable: hardTables.role,
			}),
			userHasRole: dbbyHardcoded({
				actualTable: authTables.userHasRole,
				hardTable: hardTables.userHasRole,
			}),
			privilege: dbbyHardcoded({
				actualTable: authTables.privilege,
				hardTable: hardTables.privilege,
			}),
			roleHasPrivilege: dbbyHardcoded({
				actualTable: authTables.roleHasPrivilege,
				hardTable: hardTables.roleHasPrivilege,
			}),
		}

		const appNamespacedTables = prepareConstrainTables({
			...authTables,
			...permissionsTables,
		})({[namespaceKeyAppId]: appId})

		const globalTables: AuthTablesGlobal = {
			appOwnership: authTables.appOwnership,
			app: dbbyHardcoded({
				actualTable: authTables.app,
				hardTable: hardAppTable,
			}),
		}

		return {
			...appNamespacedTables,
			...globalTables,
		}
	}
}
