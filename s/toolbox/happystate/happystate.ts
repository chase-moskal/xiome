
import {debounce} from "../debounce/debounce.js"
import {deepClone, deepFreeze} from "../deep.js"
import {AnyListener, pubsub, Subscribe} from "../pubsub.js"

export type Actions = {[key: string]: (...args: any[]) => void}

export interface Happy<xState extends {}, xActions extends Actions> {
	actions: xActions
	getState: () => xState
	clearStateListeners: () => void
	onStateChange: Subscribe<AnyListener>
}

export function happystate<xState extends {}, xActions extends Actions>({
		state: realState,
		actions: makeActions,
	}: {
		state: xState
		actions: (state: xState) => xActions
	}): Happy<xState, xActions> {

	let frozenState = deepFreeze(deepClone(realState))

	const actions = makeActions(realState)

	const {
		publish,
		subscribe: onStateChange,
		dispose: clearStateListeners,
	} = pubsub()

	const change = debounce(1, publish)

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
