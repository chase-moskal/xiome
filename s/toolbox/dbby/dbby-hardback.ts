
import {DbbyConditional, DbbyRow, DbbyTable} from "./dbby-types.js"

export function dbbyHardback<Row extends DbbyRow>({frontTable, backTable}: {
			backTable: DbbyTable<Row>
			frontTable: DbbyTable<Row>
		}): DbbyTable<Row> {

	async function one(options: DbbyConditional<Row>) {
		return await backTable.one(options) ?? await frontTable.one(options)
	}

	return {
		one,
		create: frontTable.create,
		update: frontTable.update,
		delete: frontTable.delete,

		async read(options) {
			const [hardRows, actualRows] = await Promise.all([
				backTable.read(options),
				await frontTable.read(options),
			])
			return [...hardRows, ...actualRows]
		},

		async assert(options) {
			const row = await one(options)
			return row || await (async() => {
				const newRow = await options.make()
				await frontTable.create(newRow)
				return newRow
			})()
		},

		async count(options) {
			const [hardCount, actualCount] = await Promise.all([
				backTable.count(options),
				frontTable.count(options),
			])
			return hardCount + actualCount
		},
	}
}
