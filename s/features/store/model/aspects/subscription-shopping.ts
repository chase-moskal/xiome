
import {Service} from "../../../../types/service.js"
import {makeActivator} from "../utils/make-activator.js"
import {makeStoreState} from "../state/make-store-state.js"
import {makeStoreAllowance} from "../utils/make-store-allowance.js"
import {makeShoppingService} from "../../api/services/shopping-service.js"

export function makeSubscriptionShoppingSubmodel({
		state,
		allowance,
		shoppingService,
	}: {
		state: ReturnType<typeof makeStoreState>
		allowance: ReturnType<typeof makeStoreAllowance>
		shoppingService: Service<typeof makeShoppingService>
	}) {

	const activator = makeActivator(async() => {})
	return {
		activate: activator.activate,
		refresh: activator.refreshIfActivated,
	}
}
