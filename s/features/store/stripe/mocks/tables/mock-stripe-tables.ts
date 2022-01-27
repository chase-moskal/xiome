
import * as dbmage from "dbmage"
import {mockStripeShape, MockStripeTables} from "./types/mock-stripe-database.js"
import {FlexStorage} from "dbmage"
import {makeTableNameWithHyphens} from "../../../../../common/make-table-name-with-hyphens.js"

export async function mockStripeTables({tableStorage}: {tableStorage: FlexStorage}) {
	const database = dbmage.flex<any>({
		shape: mockStripeShape,
		flexStorage: tableStorage,
		makeTableName: makeTableNameWithHyphens,
	})
	return <MockStripeTables>database.tables
}
