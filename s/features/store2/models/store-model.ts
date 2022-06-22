
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

export function makeStoreModel(options: {
		services: StoreServices
		popups: StorePopups
		reauthorize: () => Promise<void>
	}) {

	const stateDetails = setupStoreState(options)

	const submodels = setupStoreSubmodels({
		...options,
		...stateDetails,
		reloadStore: async() => initLogic.load(),
	})

	const initLogic = setupLogicForInitAndLoading({
		...options, ...stateDetails,
		submodels,
		loadStore: async() => {
			await submodels.connect.load()
			await Promise.all([
				submodels.billing.load(),
				submodels.subscriptions.load(),
			])
		}
	})

	return {
		...stateDetails,
		...submodels,
		...initLogic,
	}














	// //
	// // setup store state that all store submodels share
	// //

	// const snap = makeStoreState()
	// const allowance = makeStoreAllowance(snap)

	// function isStoreActive() {
	// 	return ops.value(snap.state.stripeConnect.connectStatusOp)
	// 		=== StripeConnectStatus.Ready
	// }

	// function isUserLoggedIn() {
	// 	return !!ops.value(snap.state.user.accessOp)?.user
	// }

	// //
	// // create store submodels
	// //

	// const subscriptions = makeSubscriptionsSubmodel({
	// 	snap, isStoreActive, isUserLoggedIn, reauthorize, popups, services
	// })

	// const billing = makeBillingSubmodel({
	// 	snap, allowance, isStoreActive, isUserLoggedIn, popups, services
	// })

	// const connect = makeConnectSubmodel({
	// 	snap, allowance,
	// 	popups, services,
	// 	reloadStore,
	// })

	// //
	// // setup logic for initialization and loading
	// //

	// async function load() {
	// 	if (ops.isReady(snap.state.user.accessOp)) {
	// 		await connect.load()
	// 		await Promise.all([
	// 			billing.load(),
	// 			subscriptions.load(),
	// 		])
	// 	}
	// }

	// let initialized = false

	// async function initialize() {
	// 	if (!initialized) {
	// 		initialized = true
	// 		await load()
	// 	}
	// }

	// async function refresh() {
	// 	if (initialized) {
	// 		await load()
	// 	}
	// }

	// return {
	// 	initialize,
	// 	refresh,

	// 	allowance,
	// 	state: snap.readable,
	// 	snap: restricted(snap),

	// 	connectSubmodel,
	// 	subscriptionsSubmodel,
	// 	billingSubmodel,

	// 	async updateAccessOp(op: Op<AccessPayload>) {
	// 		snap.state.user.accessOp = op
	// 		await refresh()
	// 	},
	// }
}
