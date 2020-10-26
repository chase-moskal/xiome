
import {DbbyRow, DbbyStorage} from "./dbby-types.js"
import {SimpleStorage, makeJsonStorage} from "../json-storage.js"

const indexKey = "dbby-index"

type DbbyIndex = {
	key: string
}[]

export function wipeAllDbbyStorage(storage: SimpleStorage) {
	const jsonStorage = makeJsonStorage(storage)
	const index = jsonStorage.read<DbbyIndex>(indexKey)
	for (const {key} of index) {
		jsonStorage.delete(key)
	}
	jsonStorage.delete(indexKey)
}

export function makeDbbyStorage<Row extends DbbyRow = any>(
		storage: SimpleStorage,
		name: string
	): DbbyStorage<Row> {

	const jsonStorage = makeJsonStorage(storage)
	const key = `dbby-table-${name}`

	function updateIndex(key: string) {
		const index = jsonStorage.read<DbbyIndex>(indexKey) || []
		const exists = !!index.find(i => i.key === key)
		if (!exists) index.push({key})
		jsonStorage.write(indexKey, index)
	}

	return {

		save(table: Row[]) {
			jsonStorage.write(key, table)
			updateIndex(key)
		},

		load(): Row[] {
			return jsonStorage.read(key)
		},
	}
}
