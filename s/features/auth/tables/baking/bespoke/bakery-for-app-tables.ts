
import {AppRow} from "../../types/rows/app-row.js"
import {AppTables} from "../../types/table-groups/app-tables.js"
import {dbbyMemory} from "../../../../../toolbox/dbby/dbby-memory.js"
import {dbbyHardback} from "../../../../../toolbox/dbby/dbby-hardback.js"
import {originsToDatabase} from "../../../topics/origins/origins-to-database.js"
import {SecretConfig} from "../../../../../assembly/backend/types/secret-config.js"

export function bakeryForAppTables({config, appTables}: {
		config: SecretConfig
		appTables: AppTables
	}) {

	return async function bakeAppTables(): Promise<AppTables> {
		const platformApp = config.platform.appDetails
		return {
			app: dbbyHardback({
				frontTable: appTables.app,
				backTable: await dbbyMemory<AppRow>([
					{
						appId: platformApp.appId,
						home: platformApp.home,
						label: platformApp.label,
						origins: originsToDatabase(platformApp.origins),
						archived: false,
					}
				]),
			}),
			appOwnership: appTables.appOwnership,
		}
	}
}
