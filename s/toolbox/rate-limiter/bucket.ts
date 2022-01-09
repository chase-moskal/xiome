
export class Bucket<Item> {
	#maximum: number
	#storage: Item[] = []

	constructor({maximum}: {maximum: number}) {
		this.#maximum = maximum
	}

	add(item: Item) {
		this.#storage.push(item)
		if (this.#storage.length > this.#maximum)
			this.#storage = this.#storage.slice(-this.#maximum)
	}

	read(): Item[] {
		return [...this.#storage]
	}
}
