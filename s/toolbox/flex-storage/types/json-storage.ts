
export interface JsonStorage {
	read<T>(key: string): T
	write<T>(key: string, data: T): void
	delete(key: string): void
}
