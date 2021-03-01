
import {dbbyMemory} from "../../../../../toolbox/dbby/dbby-memory.js"
import {AppRow, AppTables, PlatformConfig} from "../../../types/auth-types.js"
import {dbbyHardback} from "../../../../../toolbox/dbby/dbby-hardback.js"
import {originsToDatabase} from "../../../topics/origins/origins-to-database.js"

export function bakeryForAppTables({config, appTables}: {
			config: PlatformConfig
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
