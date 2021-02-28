
import {namespaceKeyAppId} from "../../constants/namespace-key-app-id.js"
import {DbbyRow, DbbyTable} from "../../../../../toolbox/dbby/dbby-types.js"
import {prepareConstrainTables} from "../../../../../toolbox/dbby/dbby-constrain.js"

export function prepareNamespacerForTables<
			xTables extends {[key: string]: DbbyTable<DbbyRow>}
		>(tables: xTables) {

	return async function bakeTable(appId: string) {
		return prepareConstrainTables(tables)({[namespaceKeyAppId]: appId})
	}
}
