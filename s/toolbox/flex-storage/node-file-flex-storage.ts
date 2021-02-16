
import {FlexStorage} from "./types/flex-storage.js"
import {nodeSafeFileOperations} from "./internal/node-safe-file-operations.js"

export function nodeFileFlexStorage(path: string): FlexStorage {
	const operation = nodeSafeFileOperations(path)
	return {

		async read(key) {
			const map = await operation()
			return map.get(key)
		},

		async write(key, data) {
			await operation(async map => {
				map.set(key, data)
				return map
			})
		},

		async delete(key) {
			await operation(async map => {
				map.delete(key)
				return map
			})
		},
	}
}
