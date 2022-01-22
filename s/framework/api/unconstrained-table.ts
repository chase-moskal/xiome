
import {objectMap} from "../../toolbox/object-map.js"
import * as dbproxy from "../../toolbox/dbproxy/dbproxy.js"
import {SchemaToUnconstrainedTables} from "./types/unconstrained-tables.js"
import {AppConstraint, appConstraintKey} from "../../assembly/backend/types/database.js"

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

	static constrainTablesForApp<xSchema extends dbproxy.Schema>({
			appId, unconstrainedTables,
		}: {
			appId: dbproxy.Id
			unconstrainedTables: SchemaToUnconstrainedTables<xSchema>
		}) {

		function recurse(tables: any) {
			return objectMap(tables, value =>
				value instanceof UnconstrainedTable
					? value.constrainForApp(appId)
					: recurse(value)
			)
		}

		return <dbproxy.ConstrainTables<
				{[appConstraintKey]: dbproxy.Id}, dbproxy.SchemaToTables<xSchema>>
			>recurse(unconstrainedTables)
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

	unconstrained: dbproxy.UnconstrainTable<AppConstraint, dbproxy.Table<xRow>>

	constructor(table: dbproxy.Table<xRow>) {
		this.unconstrained = <dbproxy.UnconstrainTable<AppConstraint, dbproxy.Table<xRow>>>table
	}

	constrainForApp(appId: dbproxy.Id) {
		return dbproxy.constrain({
			table: this.unconstrained,
			constraint: {[appConstraintKey]: appId}
		})
	}
}
