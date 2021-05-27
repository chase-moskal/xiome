
import {pubsub} from "../pubsub.js"
import {debounce2} from "../debounce2.js"
import {deepClone, deepFreeze} from "../deep.js"

type Actions = {[key: string]: (...args: any[]) => void}

export function happystate<xState extends {}, xActions extends Actions>({
		state: realState,
		actions: makeActions,
	}: {
		state: xState
		actions: (state: xState) => xActions
	}) {

	let frozenState = deepFreeze(deepClone(realState))
	const actions = makeActions(realState)
	const {publish, subscribe, dispose} = pubsub()
	const change = debounce2(1, publish)

	const augmentedActions = <Actions>{}
	for (const [key, action] of Object.entries(actions)) {
		augmentedActions[key] = (...args: any[]) => {
			action(...args)
			frozenState = deepFreeze(deepClone(realState))
			change()
		}
	}

	function getState() {
		return <xState>frozenState
	}

	return {
		actions: <xActions>augmentedActions,
		getState,
		subscribe,
		dispose,
	}
}
