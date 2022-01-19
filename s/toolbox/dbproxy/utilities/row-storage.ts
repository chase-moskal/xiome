
import {Row} from "../types.js"
import {deserialize, serialize} from "./id-serialization.js"
import {FlexStorage} from "../../flex-storage/types/flex-storage.js"

export class RowStorage {
	#storage: FlexStorage

	constructor(storage: FlexStorage) {
		this.#storage = storage
	}

	async save(key: string, rows: Row[]) {
		return this.#storage.write(key, rows.map(serialize))
	}

	async load(key: string) {
		const serializedRows = await this.#storage.read<Row[]>(key)
		return serializedRows.map(deserialize)
	}
}
