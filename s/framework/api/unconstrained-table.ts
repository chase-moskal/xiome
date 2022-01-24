
import {objectMap} from "../../toolbox/object-map.js"
import * as dbproxy from "../../toolbox/dbproxy/dbproxy.js"
import {AppConstraint, appConstraintKey} from "../../assembly/backend/types/database.js"
import {ConstrainMixedTables, SchemaToUnconstrainedTables, TablesMixed} from "./types/unconstrained-tables.js"

export class UnconstrainedTable<xRow extends dbproxy.Row> {

	static wrapTables<xSchema extends dbproxy.Schema>(
			tables: dbproxy.SchemaToTables<xSchema>
		) {
		function recurse(t: any) {
			return objectMap(t, value =>
				dbproxy.isTable(value)
					? new UnconstrainedTable(value)
					: recurse(value)
			)
		}
		return <SchemaToUnconstrainedTables<xSchema>>recurse(tables)
	}

	static unwrapTables<xSchema extends dbproxy.Schema>(
			unconstrainedTables: SchemaToUnconstrainedTables<xSchema>
		) {
		function recurse(tables: any) {
			return objectMap(tables, value =>
				value instanceof UnconstrainedTable
					? value.unconstrained
					: recurse(value)
			)
		}
		return <dbproxy.ConstrainTables<
			{[appConstraintKey]: dbproxy.Id}, dbproxy.SchemaToTables<xSchema>>
		>recurse(unconstrainedTables)
	}

	static wrapDatabase<xSchema extends dbproxy.Schema>(
			database: dbproxy.Database<xSchema>
		) {
		return dbproxy.subsection(
			database,
			tables => UnconstrainedTable.wrapTables(tables)
		)
	}

	static constrainTablesForApp<xTables extends TablesMixed>({
			appId,
			unconstrainedTables,
		}: {
			appId: dbproxy.Id
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

	static constrainDatabaseForApp<xDatabase extends dbproxy.DatabaseLike<TablesMixed>>({
			appId,
			database,
		}: {
			appId: dbproxy.Id
			database: xDatabase
		}) {
		function recurse(tables: any) {
			return objectMap(tables, value =>
				value instanceof UnconstrainedTable
					? value.constrainForApp(appId)
					: dbproxy.isTable(value)
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

	unconstrained: dbproxy.UnconstrainTable<AppConstraint, dbproxy.Table<xRow>>

	constructor(table: dbproxy.Table<xRow>) {
		this.unconstrained = <dbproxy.UnconstrainTable<AppConstraint, dbproxy.Table<xRow>>>table
	}

	constrainForApp(appId: dbproxy.Id) {
		return dbproxy.constrain({
			table: this.unconstrained,
			constraint: {[appConstraintKey]: appId},
		})
	}
}
