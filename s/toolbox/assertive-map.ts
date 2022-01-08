
export class AssertiveMap<Key, Value> extends Map<Key, Value> {

	#makeValue: (key: Key) => Value

	constructor(makeValue: (key: Key) => Value, entries?: readonly (readonly [Key, Value])[] | null) {
		super(entries)
		this.#makeValue = makeValue
	}

	assert(key: Key) {
		if (this.has(key)) {
			return this.get(key)
		}
		else {
			const value = this.#makeValue(key)
			this.set(key, value)
			return value
		}
	}
}
