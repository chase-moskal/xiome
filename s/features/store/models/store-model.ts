
import {FlexStorage} from "dbmage"
import {restricted} from "@chasemoskal/snapstate"

import {Service} from "../../../types/service.js"
import {Op, ops} from "../../../framework/ops.js"
import {makeStoreState} from "./state/make-store-state.js"
import {AccessPayload} from "../../auth/types/auth-tokens.js"
import {makeStoreAllowance} from "./utils/make-store-allowance.js"
import {makeConnectSubmodel} from "./submodels/connect-submodel.js"
import {makeConnectService} from "../api/services/connect-service.js"
import {makeSubscriptionPlanningService} from "../api/services/subscription-planning-service.js"
import {makeSubscriptionsSubmodel} from "./submodels/subscriptions-submodel.js"
import {TriggerStripeConnectPopup, TriggerCheckoutPopup, TriggerStripeLogin} from "../types/store-popups.js"
import {makeBillingSubmodel} from "./submodels/billing-submodel.js"
import {makeBillingService} from "../api/services/billing-service.js"
import {makeSubscriptionShoppingService} from "../api/services/subscription-shopping-service.js"

export function makeStoreModel(options: {
		appId: string
		storageForCache: FlexStorage
		connectService:
			Service<typeof makeConnectService>
		subscriptionPlanningService:
			Service<typeof makeSubscriptionPlanningService>
		subscriptionShoppingService:
			Service<typeof makeSubscriptionShoppingService>
		billingService:
			Service<typeof makeBillingService>
		triggerStripeLogin: TriggerStripeLogin
		triggerStripeConnectPopup: TriggerStripeConnectPopup
		triggerCheckoutPaymentMethodPopup: TriggerCheckoutPopup
	}) {

	const snap = makeStoreState()
	const allowance = makeStoreAllowance(snap)

	const connectSubmodel = makeConnectSubmodel({
		...options, snap, allowance
	})

	async function initializeConnectSubmodel() {
		await connectSubmodel.initialize()
	}

	const subscriptionsSubmodel = makeSubscriptionsSubmodel({
		...options, snap, allowance, initializeConnectSubmodel,
	})

	const billingSubmodel = makeBillingSubmodel({
		...options,
		snap,
		allowance,
		initializeConnectSubmodel,
	})

	return {
		allowance,
		state: snap.readable,
		snap: restricted(snap),

		connectSubmodel,
		subscriptionsSubmodel,
		billingSubmodel,

		async updateAccessOp(op: Op<AccessPayload>) {
			snap.writable.user.accessOp = op
			snap.writable.stripeConnect.connectStatusOp = ops.none()
			snap.writable.stripeConnect.connectDetailsOp = ops.none()
			await Promise.all([
				connectSubmodel.refresh(),
			])
		},
	}
}
