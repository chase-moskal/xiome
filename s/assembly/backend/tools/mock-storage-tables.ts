
import * as dbmage from "dbmage"
import {FlexStorage} from "dbmage"
import {makeTableNameWithHyphens} from "../../../common/make-table-name-with-hyphens.js"

export function mockStorageTables<xSchema extends dbmage.Schema>(
		flexStorage: FlexStorage,
		shape: dbmage.SchemaToShape<xSchema>,
	) {

	return dbmage.flex({
		shape,
		flexStorage,
		makeTableName: makeTableNameWithHyphens,
	}).tables
}
