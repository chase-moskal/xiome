
import {objectMap} from "../../toolbox/object-map.js"
import * as dbmage from "dbmage"
import {AppConstraint, appConstraintKey} from "../../assembly/backend/types/database.js"
import {ConstrainMixedTables, SchemaToUnconstrainedTables, TablesMixed} from "./types/unconstrained-tables.js"

export class UnconstrainedTable<xRow extends dbmage.Row> {

	static wrapTables<xSchema extends dbmage.Schema>(
			tables: dbmage.SchemaToTables<xSchema>
		) {
		function recurse(t: any) {
			return objectMap(t, value =>
				dbmage.isTable(value)
					? new UnconstrainedTable(value)
					: recurse(value)
			)
		}
		return <SchemaToUnconstrainedTables<xSchema>>recurse(tables)
	}

	static unwrapTables<xSchema extends dbmage.Schema>(
			unconstrainedTables: SchemaToUnconstrainedTables<xSchema>
		) {
		function recurse(tables: any) {
			return objectMap(tables, value =>
				value instanceof UnconstrainedTable
					? value.unconstrained
					: recurse(value)
			)
		}
		return <dbmage.ConstrainTables<
			{[appConstraintKey]: dbmage.Id}, dbmage.SchemaToTables<xSchema>>
		>recurse(unconstrainedTables)
	}

	static wrapDatabase<xSchema extends dbmage.Schema>(
			database: dbmage.Database<xSchema>
		) {
		return dbmage.subsection(
			database,
			tables => UnconstrainedTable.wrapTables(tables)
		)
	}

	static constrainTablesForApp<xTables extends TablesMixed>({
			appId,
			unconstrainedTables,
		}: {
			appId: dbmage.Id
			unconstrainedTables: xTables
		}) {
		function recurse(tables: any) {
			return objectMap(tables, value =>
				value instanceof UnconstrainedTable
					? value.constrainForApp(appId)
					: recurse(value)
			)
		}
		return <ConstrainMixedTables<xTables>>recurse(unconstrainedTables)
	}

	static constrainDatabaseForApp<xDatabase extends dbmage.DatabaseLike<TablesMixed>>({
			appId,
			database,
		}: {
			appId: dbmage.Id
			database: xDatabase
		}) {
		function recurse(tables: any) {
			return objectMap(tables, value =>
				value instanceof UnconstrainedTable
					? value.constrainForApp(appId)
					: dbmage.isTable(value)
						? value
						: recurse(value)
			)
		}
		return {
			tables: <ConstrainMixedTables<xDatabase["tables"]>>recurse(database.tables),
			transaction: (async<xResult>(action: ({}: {
				tables: ConstrainMixedTables<xDatabase["tables"]>
				abort: () => Promise<void>
			}) => xResult) => database.transaction<xResult>(async({tables, abort}) => action({
				tables: recurse(tables),
				abort,
			})))
		}
	}

	unconstrained: dbmage.UnconstrainTable<AppConstraint, dbmage.Table<xRow>>

	constructor(table: dbmage.Table<xRow>) {
		this.unconstrained = <dbmage.UnconstrainTable<AppConstraint, dbmage.Table<xRow>>>table
	}

	constrainForApp(appId: dbmage.Id) {
		return dbmage.constrain({
			table: this.unconstrained,
			constraint: {[appConstraintKey]: appId},
		})
	}
}
