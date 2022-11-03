
import * as dbmage from "dbmage"
import {MetaDataTables} from "./types.js"
import {makeTableNameWithHyphens} from "../../../../../../../common/make-table-name-with-hyphens.js"

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
