
import * as dbproxy from "../../../toolbox/dbproxy/dbproxy.js"

import {objectMap} from "../../../toolbox/object-map.js"
import {databaseShapeUnisolated} from "./database-shapes.js"
import {DatabaseSchema, DatabaseSchemaUnisolated} from "../types/database.js"
import {UnconstrainedTable} from "../../../framework/api/unconstrained-table.js"

export function applyDatabaseWrapping(database: dbproxy.Database<DatabaseSchema>) {
	return dbproxy.subsection(
		database,
		tables => {
			const wrappedTables = UnconstrainedTable.wrapTables(tables)
			const nakedTables = (<dbproxy.SchemaToTables<DatabaseSchemaUnisolated>>
				objectMap(databaseShapeUnisolated, (v, key) => database.tables[key])
			)
			return {
				...wrappedTables,
				...nakedTables,
			}
		}
	)
}
