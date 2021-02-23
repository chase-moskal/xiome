
import {PayTables} from "../../types/tables/pay-tables.js"
import {BakePayTables} from "../../types/tables/bake-pay-tables.js"

export function payTableBakery({rawPayTables}: {rawPayTables: PayTables}): BakePayTables {
	return function bakePayTables(appId: string) {
		return rawPayTables
	}
}
