
import {PayTables} from "../../types/tables/pay-tables.js"
import {BakePayTables} from "../types/bake-pay-tables.js"
import {prepareConstrainTables} from "../../../../../toolbox/dbby/dbby-constrain.js"
import {namespaceKeyAppId} from "../../../../auth/tables/constants/namespace-key-app-id.js"

export function payTableBakery({rawPayTables}: {
		rawPayTables: PayTables
	}): BakePayTables {

	return function bakePayTables(appId: string) {
		const namespacedPayTables = prepareConstrainTables(rawPayTables)({
			[namespaceKeyAppId]: appId,
		})
		return namespacedPayTables
	}
}
