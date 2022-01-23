
import {UnconstrainedTable} from "../unconstrained-table.js"
import * as dbproxy from "../../../toolbox/dbproxy/dbproxy.js"
import {AppConstraint} from "../../../assembly/backend/types/database.js"

export type SchemaToUnconstrainedTables<xSchema extends dbproxy.Schema> = {
	[P in keyof xSchema]: xSchema[P] extends dbproxy.Row
		? UnconstrainedTable<xSchema[P]>
		: xSchema[P] extends dbproxy.Schema
			? SchemaToUnconstrainedTables<xSchema[P]>
			: never
}

export interface TablesMixed {
	[key: string]:
		UnconstrainedTable<dbproxy.Row> |
		dbproxy.Table<dbproxy.Row> |
		TablesMixed
}

export type ReconstrainTable<xTable extends UnconstrainedTable<dbproxy.Row>> =
	xTable extends UnconstrainedTable<infer xRow>
		? dbproxy.Table<xRow>
		: never

export type ConstrainMixedTables<xTables extends TablesMixed> = {
	[P in keyof xTables]: xTables[P] extends UnconstrainedTable<infer xRow>
		? dbproxy.ConstrainTable<AppConstraint, dbproxy.Table<xRow>>
		: xTables[P] extends dbproxy.Table<dbproxy.Row>
			? xTables[P]
			: xTables[P] extends TablesMixed
				? ConstrainMixedTables<xTables[P]>
				: never
}
