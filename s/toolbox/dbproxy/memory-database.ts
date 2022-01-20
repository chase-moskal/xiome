
import {flexDatabase} from "./flex-database.js"
import {Schema, SchemaToShape} from "./types.js"
import {memoryFlexStorage} from "../flex-storage/memory-flex-storage.js"

export function memoryDatabase<xSchema extends Schema>(
		shape: SchemaToShape<xSchema>
	) {

	return flexDatabase(memoryFlexStorage(), shape)
}
