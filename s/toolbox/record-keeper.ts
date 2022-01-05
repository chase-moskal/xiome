
// TODO obsolete
// usage of these functions should be replaced by the better assertive-map.ts

export function strongRecordKeeper<Key>() {
	return function<Record>(makeRecord: (key: Key) => Record) {

		const map = new Map<Key, Record>()

		return function getRecord(key: Key) {
			let record: Record
			if (map.has(key))
				record = map.get(key)
			else {
				record = makeRecord(key)
				map.set(key, record)
			}
			return record
		}
	}
}

export function weakRecordKeeper<Key extends {}>() {
	return function<State>(
			makeState: (key: Key) => State
		) {

		const weakMap = new WeakMap<Key, State>()

		return function getState(key: Key) {
			let state: State
			if (weakMap.has(key)) {
				state = weakMap.get(key)
			}
			else {
				state = makeState(key)
				weakMap.set(key, state)
			}
			return state
		}
	}
}
