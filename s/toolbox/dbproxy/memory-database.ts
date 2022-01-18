
import {objectMap} from "../object-map.js"
import {FlexStorage} from "../flex-storage/types/flex-storage.js"
import {Database, Schema, SchemaToShape, SchemaToTables, Shape, Table} from "./types.js"

export function memoryDatabase<xSchema extends Schema>(
		storage: FlexStorage,
		shape: SchemaToShape<xSchema>,
	): Database<xSchema> {

	function makeTable(storageKey: string): Table<any> {
		return {
			async create() {},
			async read() {return []},
			async update() {},
			async delete() {},
		}
	}

	function makeTables(): SchemaToTables<xSchema> {
		function recurse(shape: Shape, path: string[]) {
			return objectMap(shape, (value, key) =>
				typeof value === "boolean"
					? makeTable([...path, key].join("."))
					: recurse(value, [...path, key])
			)
		}
		return recurse(shape, [])
	}

	return {
		tables: makeTables(),
		async transaction(action) {
			return action({
				tables: makeTables(),
				abort: () => {},
			})
		},
	}
}

// type Lol = AsSchema<{
// 	emails: {email: string}
// 	group: {
// 		e: {int: number}
// 	}
// }>

// const database = memoryDatabase<Lol>(memoryFlexStorage(), {
// 	emails: true,
// 	group: {
// 		e: true,
// 	},
// })

// database.transaction(async({tables, abort}) => {})
