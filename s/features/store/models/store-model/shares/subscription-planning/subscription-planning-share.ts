
import {storeCore} from "../../core/store-core.js"

export function subscriptionPlanningShare({watch, state, actions}: ReturnType<typeof storeCore>) {
	watch(() => {
		const {access} = state
	})

	return {
		async accessChange() {}
	}
}
