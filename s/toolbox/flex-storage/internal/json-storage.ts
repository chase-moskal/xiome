
import {JsonStorage} from "../types/json-storage.js"
import {SimpleStorage} from "../types/simple-storage.js"

export function jsonStorage(storage: SimpleStorage): JsonStorage {
	return {

		read<T>(key: string): T {
			let data = undefined
			const raw = storage.getItem(key)
			if (raw) {
				try {
					data = JSON.parse(raw)
				}
				catch (error) {
					storage.removeItem(key)
				}
			}
			return data
		},

		write<T>(key: string, data: T) {
			const json = JSON.stringify(data)
			storage.setItem(key, json)
		},

		delete(key: string) {
			storage.removeItem(key)
		},
	}
}
