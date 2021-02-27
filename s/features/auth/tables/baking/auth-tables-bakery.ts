
import {PlatformConfig} from "../../auth-types.js"
import {AuthTables} from "../types/auth-tables.js"
import {bakeryForAppTables} from "./bespoke/bakery-for-app-tables.js"
import {prepareTableNamespacer} from "./generic/prepare-table-namespacer.js"
import {bakeryForPermissionsTables} from "./bespoke/bakery-for-permissions-tables.js"

export function authTablesBakery({config, authTables}: {
			config: PlatformConfig
			authTables: AuthTables
		}) {

	const bakeUserTables = prepareTableNamespacer(authTables.user)
	const bakeAppTables = bakeryForAppTables({
		config,
		appTables: authTables.app,
	})
	const bakePermissionsTables = bakeryForPermissionsTables({
		config,
		permissionsTables: authTables.permissions,
	})

	return async function bakeTables(appId: string): Promise<AuthTables> {
		return {
			app: await bakeAppTables(appId),
			user: await bakeUserTables(appId),
			permissions: await bakePermissionsTables(appId),
			pay: authTables.pay,
		}
	}
}
