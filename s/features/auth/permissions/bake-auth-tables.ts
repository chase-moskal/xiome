
import {isPlatform} from "../tools/is-platform.js"
import {dbbyHardcoded} from "../../../toolbox/dbby/dbby-hardcoded.js"
import {prepareConstrainTables} from "../../../toolbox/dbby/dbby-constrain.js"
import {AuthTables, PlatformConfig, PermissionsTables, AppRow} from "../auth-types.js"

import {transformHardPermissionsToMemoryTables} from "./tables/transform-hard-permissions-to-memory-tables.js"
import { dbbyMemory } from "../../../toolbox/dbby/dbby-memory.js"
import { originsToDatabase } from "../topics/origins/origins-to-database.js"

const namespaceKeyAppId = "_appId"

export function bakeAuthTables({config, authTables}: {
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

		const platformDetails = config.platform.appDetails
		const hardAppTable = dbbyMemory<AppRow>({rows: [{
			appId: platformDetails.appId,
			home: platformDetails.home,
			label: platformDetails.label,
			origins: originsToDatabase(platformDetails.origins),
			archived: false,
		}]})

		const hardbackedAuthTables = {
			app: dbbyHardcoded({
				actualTable: authTables.app,
				hardTable: hardAppTable,
			}),
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

		return {
			...authTables,
			...prepareConstrainTables(hardbackedAuthTables)({
				[namespaceKeyAppId]: appId
			}),
		}
	}
}
