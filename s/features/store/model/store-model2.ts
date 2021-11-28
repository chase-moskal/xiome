
import {Op, ops} from "../../../framework/ops.js"
import {Service} from "../../../types/service.js"
import {makeBankSubmodel} from "./aspects/bank.js"
import {makeStoreState} from "./state/make-store-state.js"
import {makeEcommerceSubmodel} from "./aspects/ecommerce.js"
import {AccessPayload} from "../../auth/types/auth-tokens.js"
import {makeStoreAllowance} from "./utils/make-store-allowance.js"
import {TriggerBankPopup} from "./shares/types/trigger-bank-popup.js"
import {makeShoppingService} from "../api/services/shopping-service.js"
import {makeShopkeepingService} from "../api/services/shopkeeping-service.js"
import {FlexStorage} from "../../../toolbox/flex-storage/types/flex-storage.js"
import {makeStatusCheckerService} from "../api/services/status-checker-service.js"
import {makeStatusTogglerService} from "../api/services/status-toggler-service.js"
import {makeStripeConnectService} from "../api/services/stripe-connect-service.js"
import {makeSubscriptionPlanningSubmodel} from "./aspects/subscription-planning.js"
import {makeSubscriptionShoppingSubmodel} from "./aspects/subscription-shopping.js"

export function makeStoreModel2(options: {
		appId: string
		storage: FlexStorage
		shoppingService: Service<typeof makeShoppingService>
		shopkeepingService: Service<typeof makeShopkeepingService>
		statusCheckerService: Service<typeof makeStatusCheckerService>
		statusTogglerService: Service<typeof makeStatusTogglerService>
		stripeAccountsService: Service<typeof makeStripeConnectService>
		triggerBankPopup: TriggerBankPopup
		subscriptionCheckoutPopup: SubscriptionCheckoutPopup
	}) {

	const state = makeStoreState()
	const allowance = makeStoreAllowance(state)

	const bank = makeBankSubmodel({...options, state})
	const ecommerce = makeEcommerceSubmodel({...options, state})
	const planning = makeSubscriptionPlanningSubmodel({...options, state, allowance})
	const subscriptionShopping = makeSubscriptionShoppingSubmodel({...options, state, allowance})

	bank.onBankChange(async() => {
		await Promise.all([
			ecommerce.refresh(),
			planning.refresh(),
			subscriptionShopping.refresh(),
		])
	})

	return {
		state: state.readable,
		subscribe: state.subscribe,
		allowance,

		bank,
		planning,
		ecommerce,
		subscriptionShopping,

		async updateAccessOp(op: Op<AccessPayload>) {
			state.writable.accessOp = op
			state.writable.stripeAccountDetailsOp = ops.ready(undefined)
			state.writable.subscriptionPlansOp = ops.ready([])
			await Promise.all([
				bank.refresh(),
				planning.refresh(),
				ecommerce.refresh(),
				subscriptionShopping.refresh(),
			])
		},
	}
}
