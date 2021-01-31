
import {formState} from "../../form/form-state.js"
import {TokenState} from "../types/token-state.js"
import {AppDisplay} from "../../../../types/apps/app-display.js"

export function tokenDepotStates() {
	const states = new WeakMap<AppDisplay, TokenState>()

	function obtainState(app: AppDisplay) {
		let state: TokenState = states.get(app)
		if (!state) {
			state = {form: formState()}
			states.set(app, state)
		}
		return state
	}

	return {obtainState}
}
