
import {PayTables} from "../../tables/types/store-tables.js"
import {PlatformConfig} from "../../../../../assembly/backend/types/platform-config.js"
import {prepareNamespacerForTables} from "../../../../auth/tables/baking/generic/prepare-namespacer-for-tables.js"

export function payTablesBakery({config, tables}: {
		config: PlatformConfig
		tables: PayTables
	}) {

	return async function bakePayTables(appId: string): Promise<PayTables> {
		return {
			billing: await prepareNamespacerForTables(tables.billing)(appId),
			merchant: await prepareNamespacerForTables(tables.merchant)(appId),
		}
	}
}
