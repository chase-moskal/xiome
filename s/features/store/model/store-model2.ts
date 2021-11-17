
import {Op, ops} from "../../../framework/ops.js"
import {Service} from "../../../types/service.js"
import {AccessPayload} from "../../auth/types/auth-tokens.js"
import {TriggerBankPopup} from "./shares/types/trigger-bank-popup.js"
import {makeShopkeepingService} from "../api/services/shopkeeping-service.js"
import {FlexStorage} from "../../../toolbox/flex-storage/types/flex-storage.js"
import {makeStatusCheckerService} from "../api/services/status-checker-service.js"
import {makeStatusTogglerService} from "../api/services/status-toggler-service.js"
import {makeStripeConnectService} from "../api/services/stripe-connect-service.js"
import {snapstate} from "../../../toolbox/snapstate/snapstate.js"
import {StoreStatus} from "../api/services/types/store-status.js"
import {SubscriptionPlan} from "../api/services/types/subscription-plan.js"
import {StripeAccountDetails} from "../api/services/types/stripe-account-details.js"

export function makeStoreModel2({
		appId,
		storage,
		shopkeepingService,
		statusCheckerService,
		statusTogglerService,
		stripeAccountsService,
		triggerBankPopup,
	}: {
		appId: string
		storage: FlexStorage
		shopkeepingService: Service<typeof makeShopkeepingService>
		statusCheckerService: Service<typeof makeStatusCheckerService>
		statusTogglerService: Service<typeof makeStatusTogglerService>
		stripeAccountsService: Service<typeof makeStripeConnectService>
		triggerBankPopup: TriggerBankPopup
	}) {

	const state = snapstate({

		accessOp:
			<Op<AccessPayload>>
				ops.none(),

		statusOp:
			<Op<StoreStatus>>
				ops.none(),

		stripeAccountDetailsOp:
			<Op<StripeAccountDetails>>
				ops.none(),

		subscriptionPlansOp:
			<Op<SubscriptionPlan[]>>
				ops.none(),

		subscriptionPlanCreationOp:
			<Op<undefined>>
				ops.none(),
	})

	const bank = (() => {
		return {
			async loadLinkedStripeAccountDetails() {
				return ops.operation({
					promise: stripeAccountsService.getConnectDetails(),
					setOp: op => state.writable.stripeAccountDetailsOp = op,
				})
			},
			async linkStripeAccount() {
				await triggerBankPopup(
					await stripeAccountsService.generateConnectSetupLink()
				)
			},
		}
	})()

	const planning = (() => {
		return {}
	})()

	const ecommerce = (() => {
		return {}
	})()

	return {
		state: state.readable,
		subscribe: state.subscribe,

		bank,
		planning,
		ecommerce,

		async updateAccessOp(op: Op<AccessPayload>) {
			state.writable.accessOp = op
		},
	}
}
