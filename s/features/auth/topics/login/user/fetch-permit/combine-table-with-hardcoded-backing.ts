
import {dbbyMemory} from "../../../../../../toolbox/dbby/dbby-memory.js"
import {dbbyHardcoded} from "../../../../../../toolbox/dbby/dbby-hardcoded.js"
import {DbbyRow, DbbyTable} from "../../../../../../toolbox/dbby/dbby-types.js"

export async function combineTableWithHardcodedBacking<Row extends DbbyRow>({hardRows, actualTable}: {
			hardRows: Row[]
			actualTable: DbbyTable<Row>
		}) {
	const hardTable = dbbyMemory<Row>()
	await hardTable.create(...hardRows)
	return dbbyHardcoded({
		hardTable,
		actualTable,
	})
}
