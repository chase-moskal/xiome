
import {UnconstrainedTable} from "../unconstrained-table.js"
import * as dbmage from "dbmage"
import {AppConstraint} from "../../../assembly/backend/types/database.js"

export type SchemaToUnconstrainedTables<xSchema extends dbmage.Schema> = {
	[P in keyof xSchema]: xSchema[P] extends dbmage.Row
		? UnconstrainedTable<xSchema[P]>
		: xSchema[P] extends dbmage.Schema
			? SchemaToUnconstrainedTables<xSchema[P]>
			: never
}

export interface TablesMixed {
	[key: string]:
		UnconstrainedTable<dbmage.Row> |
		dbmage.Table<dbmage.Row> |
		TablesMixed
}

export type ReconstrainTable<xTable extends UnconstrainedTable<dbmage.Row>> =
	xTable extends UnconstrainedTable<infer xRow>
		? dbmage.Table<xRow>
		: never

export type ConstrainMixedTables<xTables extends TablesMixed> = {
	[P in keyof xTables]: xTables[P] extends UnconstrainedTable<infer xRow>
		? dbmage.ConstrainTable<AppConstraint, dbmage.Table<xRow>>
		: xTables[P] extends dbmage.Table<dbmage.Row>
			? xTables[P]
			: xTables[P] extends TablesMixed
				? ConstrainMixedTables<xTables[P]>
				: never
}

export type ConstrainMixedDatabaseLike<xDatabase extends dbmage.DatabaseLike<any>> =
	xDatabase extends dbmage.DatabaseLike<infer xTables>
		? xTables extends TablesMixed
			? dbmage.DatabaseLike<ConstrainMixedTables<xTables>>
			: never
		: never
