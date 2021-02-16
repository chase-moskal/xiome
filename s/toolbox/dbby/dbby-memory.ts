
import {dbbyX} from "./dbby-x.js"
import {DbbyRow} from "./dbby-types.js"
import {memoryFlexStorage} from "../flex-storage/memory-flex-storage.js"

export async function dbbyMemory<Row extends DbbyRow>(rows?: Row[]) {
	const table = await dbbyX<Row>(memoryFlexStorage(), "")
	if (rows) await table.create(...rows)
	return table
}
