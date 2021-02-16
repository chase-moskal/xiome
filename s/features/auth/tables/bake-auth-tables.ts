
import {isPlatform} from "../tools/is-platform.js"
import {dbbyHardback} from "../../../toolbox/dbby/dbby-hardback.js"
import {prepareConstrainTables} from "../../../toolbox/dbby/dbby-constrain.js"
import {originsToDatabase} from "../topics/origins/origins-to-database.js"
import {AuthTables, PlatformConfig, PermissionsTables, AppRow, AuthTablesGlobal} from "../auth-types.js"
import {transformHardPermissionsToMemoryTables} from "../permissions/tables/transform-hard-permissions-to-memory-tables.js"

import {namespaceKeyAppId} from "./namespace-key-app-id.js"
import { dbbyMemory } from "../../../toolbox/dbby/dbby-memory.js"

export function bakeAuthTables({config, authTables}: {
			config: PlatformConfig
			authTables: AuthTables
		}) {

	return async function getTables({appId}: {appId: string}): Promise<AuthTables> {
		const hardTables: PermissionsTables = (
			await transformHardPermissionsToMemoryTables({
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

		const hardAppTable = await dbbyMemory<AppRow>()
		await hardAppTable.create({
			appId: platformApp.appId,
			home: platformApp.home,
			label: platformApp.label,
			origins: originsToDatabase(platformApp.origins),
			archived: false,
		})

		const permissionsTables = {
			role: dbbyHardback({
				frontTable: authTables.role,
				backTable: hardTables.role,
			}),
			userHasRole: dbbyHardback({
				frontTable: authTables.userHasRole,
				backTable: hardTables.userHasRole,
			}),
			privilege: dbbyHardback({
				frontTable: authTables.privilege,
				backTable: hardTables.privilege,
			}),
			roleHasPrivilege: dbbyHardback({
				frontTable: authTables.roleHasPrivilege,
				backTable: hardTables.roleHasPrivilege,
			}),
		}

		const appNamespacedTables = prepareConstrainTables({
			...authTables,
			...permissionsTables,
		})({[namespaceKeyAppId]: appId})

		const globalTables: AuthTablesGlobal = {
			appOwnership: authTables.appOwnership,
			app: dbbyHardback({
				frontTable: authTables.app,
				backTable: hardAppTable,
			}),
		}

		return {
			...appNamespacedTables,
			...globalTables,
		}
	}
}
