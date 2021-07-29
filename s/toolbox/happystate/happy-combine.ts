
import {Happy} from "./happystate.js"
import {AnyListener} from "../pubsub.js"

type GetState<xHappy extends Happy<{}, {}>> = xHappy extends Happy<infer State, {}>
	? State
	: never

type GetActions<xHappy extends Happy<{}, {}>> = xHappy extends Happy<{}, infer Actions>
	? Actions
	: never


type CombineStates<xHappy1 extends Happy<{}, {}>, xHappy2 extends Happy<{}, {}>> =
	GetState<xHappy1> & GetState<xHappy2>

type CombineActions<xHappy1 extends Happy<{}, {}>, xHappy2 extends Happy<{}, {}>> =
	GetActions<xHappy1> & GetActions<xHappy2>

/*
 * happyCombine is tricky to use because typescript types are tricky.
 * example:
 *     const happy = happyCombine(happy1)(happy2)(happy3).combine()
 * do take note:
 *  - you must end the curried chain with `.combine()`
 *
 *
 */
export function happyCombine<xHappy1 extends Happy<{}, {}>>(happy1: xHappy1) {
	return function<xHappy2 extends Happy<{}, {}>>(happy2: xHappy2) {
		const getHappy = (): Happy<
				CombineStates<xHappy1, xHappy2>,
				CombineActions<xHappy1, xHappy2>
			> => ({
			actions: <CombineActions<xHappy1, xHappy2>>{...happy1.actions, ...happy2.actions},
			getState: () => <CombineStates<xHappy1, xHappy2>>({...happy1.getState(), ...happy2.getState()}),
			clearStateListeners: () => {
				happy1.clearStateListeners()
				happy2.clearStateListeners()
			},
			onStateChange: (listener: AnyListener) => {
				const subscriptions = [
					happy1.onStateChange(listener),
					happy2.onStateChange(listener),
				]
				return () => subscriptions.forEach(unsubscribe => unsubscribe())
			},
		})
		function more<xHappy3 extends Happy<{}, {}>>(happy3: xHappy3) {
			return happyCombine(getHappy())(happy3)
		}
		more.combine = getHappy
		return more
	}
}
