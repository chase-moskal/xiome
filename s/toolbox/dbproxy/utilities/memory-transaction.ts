
import {objectMap} from "../../object-map.js"
import {applyOperation} from "./apply-operation.js"
import {pathToStorageKey} from "./path-to-storage-key.js"
import {rowVersusConditional} from "./memory-conditionals.js"
import {FlexStorage} from "../../flex-storage/types/flex-storage.js"
import {Action, Row, Shape, Table, Tables, Operation} from "../types.js"

export async function memoryTransaction({shape, storage, action}: {
		shape: Shape
		storage: FlexStorage
		action: Action<Tables, any>
	}) {

	const operations: Operation.Any[] = []

	const tables = (() => {
		function recurse(shape: Shape, path: string[]): Tables {
			return objectMap(shape, (value, key) => {
				const currentPath = [...path, key]
				const storageKey = pathToStorageKey(currentPath)
				let cache: Row[] = undefined
				async function loadCacheOnce() {
					if (!cache)
						cache = await storage.read(storageKey)
				}
				return typeof shape === "boolean"?
					<Table<Row>>{
						async create(...rows) {
							await loadCacheOnce()
							const operation: Operation.OpCreate = {
								type: Operation.Type.Create,
								path: currentPath,
								rows,
							}
							cache = applyOperation({operation, rows: cache})
							operations.push(operation)
						},
						async read(o) {
							await loadCacheOnce()
							return cache.filter(row => rowVersusConditional(row, o))
						},
						async update(o) {
							await loadCacheOnce()
							const operation: Operation.OpUpdate = {
								type: Operation.Type.Update,
								path: currentPath,
								update: o,
							}
							cache = applyOperation({operation, rows: cache})
							operations.push(operation)
						},
						async delete(o) {
							await loadCacheOnce()
							const operation: Operation.OpDelete = {
								type: Operation.Type.Delete,
								path: currentPath,
								conditional: o,
							}
							cache = applyOperation({operation, rows: cache})
							operations.push(operation)
						},
						async count() {
							await loadCacheOnce()
							return cache.length
						},
						async readOne(o) {
							await loadCacheOnce()
							return cache.find(row => rowVersusConditional(row, o))
						},
						async assert(o) {
							const foundRow = cache.find(row => rowVersusConditional(row, o))
							if (!foundRow) {
								const newRow = await o.make()
								const operation: Operation.OpCreate = {
									type: Operation.Type.Create,
									path: currentPath,
									rows: [newRow],
								}
								cache = applyOperation({operation, rows: cache})
								operations.push(operation)
							}
							return foundRow
						},
					}:
					recurse(shape, [])
			})
		}
		return recurse(shape, [])
	})()

	let aborted = false
	const result = action({
		tables,
		abort() {
			aborted = true
		},
	})
	if (!aborted) {
		const loadedRows = new Map<string, Row[]>()
		for (const {path} of operations) {
			const storageKey = pathToStorageKey(path)
			loadedRows.set(storageKey, await storage.read(storageKey))
		}
		for (const operation of operations) {
			const storageKey = pathToStorageKey(operation.path)
			const rows = loadedRows.get(storageKey)
			const modifiedRows = applyOperation({operation, rows})
			loadedRows.set(storageKey, modifiedRows)
		}
		for (const [storageKey, rows] of loadedRows.entries()) {
			await storage.write(storageKey, rows)
		}
	}
	return result
}
