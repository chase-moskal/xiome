
import * as dbmage from "dbmage"

import {objectMap} from "../../../toolbox/object-map.js"
import {databaseShapeUnisolated} from "./database-shapes.js"
import {DatabaseSchema, DatabaseSchemaUnisolated} from "../types/database.js"
import {UnconstrainedTable} from "../../../framework/api/unconstrained-table.js"

export function applyDatabaseWrapping(database: dbmage.Database<DatabaseSchema>) {
	return dbmage.subsection(
		database,
		tables => {
			const wrappedTables = UnconstrainedTable.wrapTables(tables)
			const nakedTables = (<dbmage.SchemaToTables<DatabaseSchemaUnisolated>>
				objectMap(databaseShapeUnisolated, (v, key) => database.tables[key])
			)
			return {
				...wrappedTables,
				...nakedTables,
			}
		}
	)
}
