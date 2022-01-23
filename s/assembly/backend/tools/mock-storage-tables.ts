
import * as dbproxy from "../../../toolbox/dbproxy/dbproxy.js"
import {FlexStorage} from "../../../toolbox/flex-storage/types/flex-storage.js"

export function mockStorageTables<xSchema extends dbproxy.Schema>(
		flexStorage: FlexStorage,
		shape: dbproxy.SchemaToShape<xSchema>,
	) {

	return dbproxy.flex(flexStorage, shape).tables
}
