
import {FlexStorage} from "dbmage"
import {snapstate} from "@chasemoskal/snapstate"

import {Service} from "../../../types/service.js"
import {Op, ops} from "../../../framework/ops.js"
import {makeStoreState} from "./state/make-store-state.js"
import {AccessPayload} from "../../auth/types/auth-tokens.js"
import {makeStoreAllowance} from "./utils/make-store-allowance.js"
import {makeConnectSubmodel} from "./submodels/connect-submodel.js"
import {makeConnectService} from "../api/services/connect-service.js"
import {TriggerStripeConnectPopup, TriggerCheckoutPopup} from "../types/store-popups.js"
import {makeSubscriptionPlanningSubmodel} from "./submodels/subscription-planning-submodel.js"
import {makeSubscriptionPlanningService} from "../api/services/subscription-planning-service.js"

export function makeStoreModel(options: {
		appId: string
		storageForCache: FlexStorage
		connectService:
			Service<typeof makeConnectService>
		subscriptionPlanningService:
			Service<typeof makeSubscriptionPlanningService>
		triggerCheckoutPopup: TriggerCheckoutPopup
		triggerStripeConnectPopup: TriggerStripeConnectPopup
	}) {

	const state = makeStoreState()
	const allowance = makeStoreAllowance(state)
	const connectSubmodel = makeConnectSubmodel({...options, state, allowance})
	const subscriptionPlanningSubmodel = makeSubscriptionPlanningSubmodel({
		...options, state, allowance,
	})

	return {
		state: state.readable,
		subscribe: state.subscribe,
		allowance,

		connectSubmodel,
		subscriptionPlanningSubmodel,

		async updateAccessOp(op: Op<AccessPayload>) {
			state.writable.user.accessOp = op
			state.writable.stripeConnect.connectStatusOp = ops.none()
			state.writable.stripeConnect.connectDetailsOp = ops.none()
			await Promise.all([
				connectSubmodel.refresh(),
			])
		},
	}
}
