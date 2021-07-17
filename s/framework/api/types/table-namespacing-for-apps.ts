
import {DamnId} from "../../../toolbox/damnedb/damn-id.js"
import {namespaceKeyAppId} from "../namespace-key-app-id.js"
import {AsDbbyRow, DbbyRow, DbbyTable} from "../../../toolbox/dbby/dbby-types.js"

//
// rows
//

export type NakedNamespacedRow<Row extends DbbyRow> = AsDbbyRow<{
	[namespaceKeyAppId]: DamnId
}> & Row

export type SafelyNamespacedRow<Row extends DbbyRow> =
	Omit<Row, typeof namespaceKeyAppId>

//
// tables
//

export type NakedNamespacedTable<xTable extends DbbyTable<DbbyRow>> = xTable extends DbbyTable<infer xRow>
	? DbbyTable<NakedNamespacedRow<xRow>>
	: never

export type SafelyNamespacedTable<xTable extends DbbyTable<DbbyRow>> = xTable extends DbbyTable<infer xRow>
	? DbbyTable<SafelyNamespacedRow<xRow>>
	: never

//
// table groups
//

type TableGroup = {[key: string]: DbbyTable<DbbyRow> | TableGroup}

export type NakedNamespacedTables<xTables extends TableGroup> = {
	[P in keyof xTables]: xTables[P] extends DbbyTable<DbbyRow>
		? NakedNamespacedTable<xTables[P]>
		: xTables[P] extends TableGroup
			? NakedNamespacedTables<xTables[P]>
			: never
}

export type SafelyNamespacedTables<xTables extends TableGroup> = {
	[P in keyof xTables]: xTables[P] extends DbbyTable<DbbyRow>
		? SafelyNamespacedTable<xTables[P]>
		: xTables[P] extends TableGroup
			? SafelyNamespacedTables<xTables[P]>
			: never
}
