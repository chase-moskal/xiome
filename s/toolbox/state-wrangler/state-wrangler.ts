
import {debounce2} from "../debounce2.js"
import {objectMap} from "../object-map.js"
import {deepClone, deepFreeze} from "../deep.js"
import {Action, Reducers, StateWranglerOptions} from "./types/state-wrangler-types.js"

export function stateWrangler<xState>({
		initial,
		render,
		debug = () => {},
	}: StateWranglerOptions<xState>) {

	let latest: xState

	const render2 = debounce2(1, () => render(latest))

	function commit(state: xState) {
		latest = <xState>deepFreeze(deepClone(state))
		debug("state", latest)
		render2()
	}

	commit(initial)

	return function actionsFromReducers<xReducers extends Reducers<xState>>(
			reducers: xReducers
		): {[P in keyof xReducers]: Action<xReducers[P]>} {

		return objectMap(reducers, (reducer, key) => (...args: any[]) => {
			debug("action", key, ...args)
			const newState = reducer(latest, ...args)
			commit(newState)
		})
	}
}
