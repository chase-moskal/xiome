
export interface FlexStorage {
	read<T>(key: string): Promise<T>
	write<T>(key: string, data: T): Promise<void>
	delete(key: string): Promise<void>
}
