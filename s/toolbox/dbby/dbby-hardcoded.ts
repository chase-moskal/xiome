
import {DbbyConditional, DbbyRow, DbbyTable} from "./dbby-types.js"

export function dbbyHardcoded<Row extends DbbyRow>({actualTable, hardTable}: {
			hardTable: DbbyTable<Row>
			actualTable: DbbyTable<Row>
		}): DbbyTable<Row> {

	async function one(options: DbbyConditional<Row>) {
		return await hardTable.one(options) ?? await actualTable.one(options)
	}

	return {
		one,
		create: actualTable.create,
		update: actualTable.update,
		delete: actualTable.delete,

		async read(options) {
			const [hardRows, actualRows] = await Promise.all([
				hardTable.read(options),
				await actualTable.read(options),
			])
			return [...hardRows, ...actualRows]
		},

		async assert(options) {
			const row = await one(options)
			return row || await (async() => {
				const newRow = await options.make()
				await actualTable.create(newRow)
				return newRow
			})()
		},

		async count(options) {
			const [hardCount, actualCount] = await Promise.all([
				hardTable.count(options),
				actualTable.count(options),
			])
			return hardCount + actualCount
		},
	}
}
