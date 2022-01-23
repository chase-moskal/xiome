
import * as dbproxy from "../../../../../toolbox/dbproxy/dbproxy.js"
import {mockStripeShape, MockStripeTables} from "./types/mock-stripe-database.js"
import {FlexStorage} from "../../../../../toolbox/flex-storage/types/flex-storage.js"

export async function mockStripeTables({tableStorage}: {tableStorage: FlexStorage}) {
	const database = dbproxy.flex<any>(tableStorage, mockStripeShape)
	return <MockStripeTables>database.tables
}
