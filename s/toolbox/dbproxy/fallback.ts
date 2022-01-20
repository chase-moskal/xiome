
import {Conditional, Row, Table} from "./types.js"

export function fallback<xRow extends Row>({fallbackTable, table}: {
		table: Table<xRow>
		fallbackTable: Table<xRow>
	}): Table<xRow> {

	async function readOne(options: Conditional<xRow>) {
		return await fallbackTable.readOne(options) ?? await table.readOne(options)
	}

	return <Table<xRow>>{
		readOne,
		create: table.create,
		update: table.update,
		delete: table.delete,

		async read(options) {
			const [hardRows, actualRows] = await Promise.all([
				fallbackTable.read(options),
				await table.read(options),
			])
			return [...hardRows, ...actualRows]
		},

		async assert(options) {
			const row = await readOne(options)
			return row || await (async() => {
				const newRow = await options.make()
				await table.create(newRow)
				return newRow
			})()
		},

		async count(options) {
			const [hardCount, actualCount] = await Promise.all([
				fallbackTable.count(options),
				table.count(options),
			])
			return hardCount + actualCount
		},
	}
}
