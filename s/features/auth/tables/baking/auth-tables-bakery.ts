
import {PlatformConfig} from "../../types/platform-config.js"
import {AuthTables} from "../types/auth-tables.js"
import {bakeryForAppTables} from "./bespoke/bakery-for-app-tables.js"
import {prepareNamespacerForTables} from "./generic/prepare-namespacer-for-tables.js"
import {bakeryForPermissionsTables} from "./bespoke/bakery-for-permissions-tables.js"

export function authTablesBakery({config, tables}: {
			config: PlatformConfig
			tables: AuthTables
		}) {

	const bakeUserTables = prepareNamespacerForTables(tables.user)
	const bakeAppTables = bakeryForAppTables({
		config,
		appTables: tables.app,
	})
	const bakePermissionsTables = bakeryForPermissionsTables({
		config,
		permissionsTables: tables.permissions,
	})

	return async function bakeTables(appId: string): Promise<AuthTables> {
		return {
			app: await bakeAppTables(),
			user: await bakeUserTables(appId),
			permissions: await bakePermissionsTables(appId),
		}
	}
}
