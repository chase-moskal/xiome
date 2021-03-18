
import {StoreTables} from "../../tables/types/store-tables.js"
import {PlatformConfig} from "../../../../../assembly/backend/types/platform-config.js"
import {prepareNamespacerForTables} from "../../../../auth/tables/baking/generic/prepare-namespacer-for-tables.js"

export function payTablesBakery({config, tables}: {
		config: PlatformConfig
		tables: StoreTables
	}) {

	return async function bakePayTables(appId: string): Promise<StoreTables> {
		return {
			billing: await prepareNamespacerForTables(tables.billing)(appId),
			merchant: await prepareNamespacerForTables(tables.merchant)(appId),
		}
	}
}
