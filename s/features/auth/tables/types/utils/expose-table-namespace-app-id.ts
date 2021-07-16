
import {DamnId} from "../../../../../toolbox/damnedb/damn-id.js"
import {namespaceKeyAppId} from "../../../../../framework/api/namespace-key-app-id.js"
import {DbbyRow, DbbyTable} from "../../../../../toolbox/dbby/dbby-types.js"

export type ExposeTableNamespaceAppId<Row extends DbbyRow> =
	DbbyTable<Row & {[namespaceKeyAppId]: DamnId}>
