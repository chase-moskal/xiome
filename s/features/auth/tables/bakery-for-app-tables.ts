
import {dbbyMemory} from "../../../toolbox/dbby/dbby-memory.js"
import {PlatformConfig, AppRow, AppTables} from "../auth-types.js"
import {dbbyHardback} from "../../../toolbox/dbby/dbby-hardback.js"
import {originsToDatabase} from "../topics/origins/origins-to-database.js"
import {prepareTableNamespacer} from "./prepare-table-namespacer.js"

export function bakeryForAppTables({config, appTables}: {
			config: PlatformConfig
			appTables: AppTables
		}) {

	return async function bakeAppTables(appId: string): Promise<AppTables> {
		const platformApp = config.platform.appDetails

		return prepareTableNamespacer({
			appOwnership: appTables.appOwnership,
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
			})
		})(appId)
	}
}
