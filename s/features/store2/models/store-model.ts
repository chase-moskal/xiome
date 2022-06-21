import {Op, ops} from "../../../framework/ops.js"
import {restricted} from "@chasemoskal/snapstate"
import {StorePopups, StoreServices} from "./types.js"
import {makeStoreState} from "./state/store-state.js"
import {AccessPayload} from "../../auth/types/auth-tokens.js"
import {StripeConnectStatus} from "../types/store-concepts.js"
import {makeStoreAllowance} from "./utils/make-store-allowance.js"
import {makeBillingSubmodel} from "./submodels/billing-submodel.js"
import {makeConnectSubmodel} from "./submodels/connect-submodel.js"
import {makeSubscriptionsSubmodel} from "./submodels/subscriptions-submodel.js"

export function makeStoreModel({appId, services, popups, reauthorize}: {
		appId: string
		services: StoreServices
		popups: StorePopups
		reauthorize: () => Promise<void>
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
		snap, isStoreActive, isUserLoggedIn, reauthorize, popups, services
	})

	const billingSubmodel = makeBillingSubmodel({
		snap, allowance, isStoreActive, isUserLoggedIn, popups, services
	})

	async function loadResourcesDependentOnConnectInfo() {
		await Promise.all([
			billingSubmodel.load(),
			subscriptionsSubmodel.load(),
		])
	}

	const connectSubmodel = makeConnectSubmodel({
		snap, allowance,
		handleConnectChange: loadResourcesDependentOnConnectInfo,
		popups, services
	})

	async function load() {
		if (ops.isReady(snap.state.user.accessOp)) {
			await connectSubmodel.load()
		}
	}

	let initialized = false

	async function initialize() {
		if (!initialized) {
			initialized = true
			await load()
		}
	}

	async function refresh() {
		if (initialized) {
			await load()
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
