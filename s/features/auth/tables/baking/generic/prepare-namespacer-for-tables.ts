
import {DamnId} from "../../../../../toolbox/damnedb/damn-id.js"
import {namespaceKeyAppId} from "../../../../../framework/api/namespace-key-app-id.js"
import {DbbyRow, DbbyTable} from "../../../../../toolbox/dbby/dbby-types.js"
import {prepareConstrainTables} from "../../../../../toolbox/dbby/dbby-constrain.js"

export function prepareNamespacerForTables<
			xTables extends {[key: string]: DbbyTable<DbbyRow>}
		>(tables: xTables) {

	return async function bakeTable(appId: DamnId) {
		return prepareConstrainTables(tables)({[namespaceKeyAppId]: appId})
	}
}
