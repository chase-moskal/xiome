
export interface SimpleStorage {
	getItem(key: string): string | undefined
	setItem(key: string, data: string): void
	removeItem(key: string): void
}
