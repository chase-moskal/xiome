
import {obtain} from "../obtain.js"
import {objectMap} from "../object-map.js"
import {RowStorage} from "./utilities/row-storage.js"
import {FlexStorage} from "../flex-storage/types/flex-storage.js"
import {memoryTransaction} from "./utilities/memory-transaction.js"
import {pathToStorageKey} from "./utilities/path-to-storage-key.js"
import {Database, Row, Schema, SchemaToShape, Shape, Table} from "./types.js"

export function flexDatabase<xSchema extends Schema>(
		flexStorage: FlexStorage,
		shape: SchemaToShape<xSchema>,
	): Database<xSchema> {

	const storage = new RowStorage(flexStorage)

	return {

		tables: (() => {
			function recurse(shape: Shape, path: string[]) {
				return objectMap(shape, (value, key) =>
					typeof value === "boolean"?
						new Proxy({}, {
							get(target, prop) {
								if (!target[prop])
									target[prop] = async(...args: any[]) => memoryTransaction({
										shape,
										storage,
										async action({tables}) {
											const table = obtain<Table<Row>>(tables, [...path, key])
											return table[key](...args)
										},
									})
								return target[prop]
							},
							set() {
								throw new Error(
									`table "${pathToStorageKey([...path, key])}" is readonly`
								)
							},
						}):
						recurse(value, [...path, key])
				)
			}
			return recurse(shape, [])
		})(),

		async transaction(action) {
			return memoryTransaction({
				shape,
				storage,
				action,
			})
		},
	}
}
