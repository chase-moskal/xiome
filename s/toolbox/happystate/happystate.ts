
import {pubsub} from "../pubsub.js"
import {debounce2} from "../debounce2.js"
import {deepClone, deepFreeze} from "../deep.js"

type Actions = {[key: string]: (...args: any[]) => void}

export function happystate<xState extends {}, xActions extends Actions>({
		state,
		actions,
	}: {
		state: xState
		actions: xActions
	}) {

	const {publish, subscribe, dispose} = pubsub()
	const change = debounce2(1, publish)

	const augmentedActions = <Actions>{}
	for (const [key, action] of Object.entries(actions)) {
		augmentedActions[key] = (...args: any[]) => {
			action(...args)
			change()
		}
	}

	return {
		get state() {
			return deepFreeze(deepClone(state))
		},
		actions: <xActions>augmentedActions,
		subscribe,
		dispose,
	}
}
