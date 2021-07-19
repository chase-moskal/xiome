
// import {DamnId} from "../../toolbox/damnedb/damn-id.js"
// import {DbbyTables} from "../../toolbox/dbby/dbby-types.js"
// import {namespaceKeyAppId} from "./namespace-key-app-id.js"
// import {AppNamespaceRow} from "./types/table-namespacing-for-apps.js"
// import {dbbyConstrainTables} from "../../toolbox/dbby/dbby-constrain.js"

// export function namespaceTables<xTables extends DbbyTables>(appId: DamnId, tables: xTables) {
// 	return dbbyConstrainTables<AppNamespaceRow, xTables>({
// 		tables,
// 		namespace: {[namespaceKeyAppId]: appId},
// 	})
// }
