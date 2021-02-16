
import {FlexStorage} from "./types/flex-storage.js"

export function memoryFlexStorage(): FlexStorage {
	const map = new Map<string, any>()
	return {

		async read(key) {
			return map.get(key)
		},

		async write(key, data) {
			map.set(key, data)
		},

		async delete(key) {
			map.delete(key)
		},
	}
}
