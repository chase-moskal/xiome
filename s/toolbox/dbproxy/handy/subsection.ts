
import {DatabaseLike} from "../types.js"

export function subsection<xDatabase extends DatabaseLike<any>, xSubsection>(
		database: xDatabase,
		grabber: (tables: xDatabase["tables"]) => xSubsection
	): DatabaseLike<xSubsection> {

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
