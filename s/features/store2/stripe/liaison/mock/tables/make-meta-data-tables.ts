
import * as dbmage from "dbmage"
import {makeTableNameWithHyphens} from "../../../../../../common/make-table-name-with-hyphens.js"
import {MetaDataTables} from "./types.js"

export async function makeMetaDataTables({tableStorage}: {
		tableStorage: dbmage.FlexStorage
	}) {

	const database = dbmage.flex<{
			paymentMethodMetaData: {id: string, isFailing: boolean}
		}>({
		shape: {
			paymentMethodMetaData: true
		},
		flexStorage: tableStorage,
		makeTableName: makeTableNameWithHyphens,
	})

	return <MetaDataTables>database.tables
}
