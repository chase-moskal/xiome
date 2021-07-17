
import {DamnId} from "../../toolbox/damnedb/damn-id.js"
import {DbbyTables} from "../../toolbox/dbby/dbby-types.js"
import {namespaceKeyAppId} from "./namespace-key-app-id.js"
import {dbbyConstrainTables} from "../../toolbox/dbby/dbby-constrain.js"

export function namespaceTables(appId: DamnId, tables: DbbyTables) {
	return dbbyConstrainTables(tables, {[namespaceKeyAppId]: appId})
}
