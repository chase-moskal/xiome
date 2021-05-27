
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

	const {
		publish,
		subscribe: onStateChange,
		dispose: clearStateListeners,
	} = pubsub()

	const change = debounce2(1, publish)

	const augmentedActions = <Actions>{}

	for (const [key, action] of Object.entries(actions)) {
		augmentedActions[key] = (...args: any[]) => {
			action(...args)
			frozenState = deepFreeze(deepClone(realState))
			change()
		}
	}

	return {
		actions: <xActions>augmentedActions,
		onStateChange,
		clearStateListeners,
		getState: () => <xState>frozenState,
	}
}
