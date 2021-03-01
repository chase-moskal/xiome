
import {DbbyRow, DbbyTable} from "../../../../../toolbox/dbby/dbby-types.js"
import {namespaceKeyAppId} from "../../constants/namespace-key-app-id.js"

export type ExposeTableNamespaceAppId<Row extends DbbyRow> =
	DbbyTable<Row & {[namespaceKeyAppId]: string}>
