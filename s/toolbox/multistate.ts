
export function multistate<Key extends {}, State>(
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
