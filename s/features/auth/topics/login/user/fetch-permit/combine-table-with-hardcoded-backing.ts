
import {dbbyMemory} from "../../../../../../toolbox/dbby/dbby-memory.js"
import {dbbyHardback} from "../../../../../../toolbox/dbby/dbby-hardback.js"
import {DbbyRow, DbbyTable} from "../../../../../../toolbox/dbby/dbby-types.js"

export async function combineTableWithHardcodedBacking<Row extends DbbyRow>({
			hardRows,
			actualTable,
		}: {
			hardRows: Row[]
			actualTable: DbbyTable<Row>
		}) {
	const hardTable = await dbbyMemory<Row>()
	await hardTable.create(...hardRows)
	return dbbyHardback({
		backTable: hardTable,
		frontTable: actualTable,
	})
}
