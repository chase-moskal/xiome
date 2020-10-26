
export interface SimpleStorage {
	getItem(key: string): string | undefined
	setItem(key: string, data: string): void
	removeItem(key: string): void
}

export interface JsonStorage {
	read<T>(key: string): T
	write<T>(key: string, data: T): void
	delete(key: string): void
}

export function makeJsonStorage(storage: SimpleStorage): JsonStorage {
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
