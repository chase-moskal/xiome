
import {databaseShape} from "./database-shapes.js"
import * as dbproxy from "../../../toolbox/dbproxy/dbproxy.js"
import {DatabaseRaw, DatabaseSchema} from "../types/database.js"
import {applyDatabaseWrapping} from "./apply-database-wrapping.js"
import {FlexStorage} from "../../../toolbox/flex-storage/types/flex-storage.js"

export function mockDatabaseUnwrapped(storage: FlexStorage) {
	return dbproxy.flex<DatabaseSchema>(storage, databaseShape)
}

export function mockDatabase(storage: FlexStorage): DatabaseRaw {
	const unwrapped = mockDatabaseUnwrapped(storage)
	return applyDatabaseWrapping(unwrapped)
}
