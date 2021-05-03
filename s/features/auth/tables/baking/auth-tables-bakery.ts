
import {AuthTables} from "../types/auth-tables.js"
import {bakeryForAppTables} from "./bespoke/bakery-for-app-tables.js"
import {PlatformConfig} from "../../../../assembly/backend/types/platform-config.js"
import {prepareNamespacerForTables} from "./generic/prepare-namespacer-for-tables.js"

export function authTablesBakery({config, tables}: {
			config: PlatformConfig
			tables: AuthTables
		}) {

	const bakeAppTables = bakeryForAppTables({
		config,
		appTables: tables.app,
	})

	return async function bakeTables(appId: string): Promise<AuthTables> {
		return {
			app: await bakeAppTables(),
			user: await prepareNamespacerForTables(tables.user)(appId),
			permissions: await prepareNamespacerForTables(tables.permissions)(appId),
		}
	}
}
