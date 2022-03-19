
import {restricted} from "@chasemoskal/snapstate"

import {Service} from "../../../types/service.js"
import {Op, ops} from "../../../framework/ops.js"
import {makeStoreState} from "./state/store-state.js"
import {AccessPayload} from "../../auth/types/auth-tokens.js"
import {StripeConnectStatus} from "../types/store-concepts.js"
import {makeStoreAllowance} from "./utils/make-store-allowance.js"
import {makeBillingSubmodel} from "./submodels/billing-submodel.js"
import {makeConnectSubmodel} from "./submodels/connect-submodel.js"
import {makeBillingService} from "../api/services/billing-service.js"
import {makeConnectService} from "../api/services/connect-service.js"
import {makeSubscriptionsSubmodel} from "./submodels/subscriptions-submodel.js"
import {makeSubscriptionPlanningService} from "../api/services/subscription-planning-service.js"
import {makeSubscriptionShoppingService} from "../api/services/subscription-shopping-service.js"
import {makeSubscriptionObserverService} from "../api/services/subscription-observer-service.js"
import {TriggerStripeConnectPopup, TriggerCheckoutPopup, TriggerStripeLogin} from "../types/store-popups.js"

export function makeStoreModel(options: {
		appId: string
		connectService:
			Service<typeof makeConnectService>
		billingService:
			Service<typeof makeBillingService>
		subscriptionPlanningService:
			Service<typeof makeSubscriptionPlanningService>
		subscriptionShoppingService:
			Service<typeof makeSubscriptionShoppingService>
		subscriptionObserverService:
			Service<typeof makeSubscriptionObserverService>
		reauthorize: () => Promise<void>
		triggerStripeLogin: TriggerStripeLogin
		triggerStripeConnectPopup: TriggerStripeConnectPopup
		triggerCheckoutPaymentMethodPopup: TriggerCheckoutPopup
		triggerCheckoutSubscriptionPopup: TriggerCheckoutPopup
	}) {

	const snap = makeStoreState()
	const allowance = makeStoreAllowance(snap)

	function isStoreActive() {
		return ops.value(snap.state.stripeConnect.connectStatusOp)
			=== StripeConnectStatus.Ready
	}

	function isUserLoggedIn() {
		return !!ops.value(snap.state.user.accessOp)?.user
	}

	const subscriptionsSubmodel = makeSubscriptionsSubmodel({
		...options, snap, allowance, isStoreActive, isUserLoggedIn,
	})

	const billingSubmodel = makeBillingSubmodel({
		...options, snap, allowance, isStoreActive, isUserLoggedIn,
	})

	async function loadResourcesDependentOnConnectInfo() {
		await Promise.all([
			billingSubmodel.load(),
			subscriptionsSubmodel.load(),
		])
	}

	const connectSubmodel = makeConnectSubmodel({
		...options, snap, allowance,
		handleConnectChange: loadResourcesDependentOnConnectInfo,
	})

	async function loadAll() {
		await connectSubmodel.load()
		await loadResourcesDependentOnConnectInfo()
	}

	let initialized = false

	async function initialize() {
		if (!initialized) {
			initialized = true
			await loadAll()
		}
	}

	async function refresh() {
		if (initialized) {
			await loadAll()
		}
	}

	return {
		initialize,
		refresh,

		allowance,
		state: snap.readable,
		snap: restricted(snap),

		connectSubmodel,
		subscriptionsSubmodel,
		billingSubmodel,

		async updateAccessOp(op: Op<AccessPayload>) {
			snap.state.user.accessOp = op
			await refresh()
		},
	}
}
