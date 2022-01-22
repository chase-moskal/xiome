
import {Database, DatabaseFromTables, Schema, Tables} from "./types.js"

export function grab<xDatabase extends Database<Schema>, xTables extends Tables>(
		database: xDatabase,
		grabber: (tables: xDatabase["tables"]) => xTables
	): DatabaseFromTables<xTables> {

	return {
		tables: grabber(database.tables),
		async transaction(action) {
			return database.transaction(async({tables, abort}) => action({
				tables: grabber(tables),
				abort,
			}))
		},
	}
}
