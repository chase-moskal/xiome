
import {FlexStorage} from "./types/flex-storage.js"
import {jsonStorage} from "./internal/json-storage.js"
import {SimpleStorage} from "./types/simple-storage.js"

export function simpleFlexStorage(storage: SimpleStorage): FlexStorage {
	const json = jsonStorage(storage)
	return {

		async read(key) {
			return json.read(key)
		},

		async write(key, data) {
			return json.write(key, data)
		},

		async delete(key) {
			return json.delete(key)
		},
	}
}
