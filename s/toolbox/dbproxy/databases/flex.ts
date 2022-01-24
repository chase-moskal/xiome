
import {obtain} from "../../obtain.js"
import {objectMap} from "../../object-map.js"
import {RowStorage} from "./flex/row-storage.js"
import {sequencer} from "../../sequencer/sequencer.js"
import {memoryTransaction} from "./flex/memory-transaction.js"
import {pathToStorageKey} from "./utils/path-to-storage-key.js"
import {FlexStorage} from "../../flex-storage/types/flex-storage.js"
import {Database, Row, Schema, SchemaToShape, Shape, Table} from "../types.js"

export function flex<xSchema extends Schema>(
		flexStorage: FlexStorage,
		shape: SchemaToShape<xSchema>,
	): Database<xSchema> {

	const storage = new RowStorage(flexStorage)
	const safeMemoryTransaction = sequencer(memoryTransaction)

	return {

		tables: (() => {
			function recurse(shape: Shape, path: string[]) {
				return objectMap(shape, (value, key) => {
					const currentPath = [...path, key]
					return typeof value === "boolean"
						? new Proxy({}, {
							get(target, prop) {
								if (!target[prop]) {
									target[prop] = async(...args: any[]) => safeMemoryTransaction({
										shape,
										storage,
										async action({tables}) {
											return tables[key][prop](...args)
										},
									})
								}
								return target[prop]
							},
							set() {
								throw new Error(
									`table "${pathToStorageKey(currentPath)}" is readonly`
								)
							},
						})
						: recurse(value, currentPath)
				})
			}
			return recurse(shape, [])
		})(),

		async transaction(action) {
			return safeMemoryTransaction({
				shape,
				storage,
				action,
			})
		},
	}
}
