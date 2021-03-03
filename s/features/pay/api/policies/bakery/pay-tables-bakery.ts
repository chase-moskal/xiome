import {PlatformConfig} from "../../../../../assembly/backend/types/platform-config.js"
import {prepareNamespacerForTables} from "../../../../auth/tables/baking/generic/prepare-namespacer-for-tables.js"
import {PayTables} from "../../tables/types/pay-tables.js"

export function payTablesBakery({config, tables}: {
		config: PlatformConfig
		tables: PayTables
	}) {
	
	return async function bakePayTables(appId: string): Promise<PayTables> {
		return {
			merchant: tables.merchant,
			billing: await prepareNamespacerForTables(tables.billing)(appId),
		}
	}
}
