
import * as dbmage from "dbmage"

import {databaseShape} from "./database-shapes.js"
import {DatabaseRaw, DatabaseSchema} from "../types/database.js"
import {applyDatabaseWrapping} from "./apply-database-wrapping.js"
import {FlexStorage} from "dbmage"
import {makeTableNameWithHyphens} from "../../../common/make-table-name-with-hyphens.js"

export function mockDatabaseUnwrapped(flexStorage: FlexStorage) {
	return dbmage.flex<DatabaseSchema>({
		flexStorage,
		shape: databaseShape,
		makeTableName: makeTableNameWithHyphens,
	})
}

export function mockDatabase(storage: FlexStorage): DatabaseRaw {
	const unwrapped = mockDatabaseUnwrapped(storage)
	return applyDatabaseWrapping(unwrapped)
}
