
import {UnconstrainedTable} from "../unconstrained-table.js"
import * as dbproxy from "../../../toolbox/dbproxy/dbproxy.js"

export type SchemaToUnconstrainedTables<xSchema extends dbproxy.Schema> = {
	[P in keyof xSchema]: xSchema[P] extends dbproxy.Row
		? UnconstrainedTable<xSchema[P]>
		: xSchema[P] extends dbproxy.Schema
			? SchemaToUnconstrainedTables<xSchema[P]>
			: never
}
