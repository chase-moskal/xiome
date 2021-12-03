
import {Service} from "../../../types/service.js"
import {Op, ops} from "../../../framework/ops.js"
import {makeStoreState} from "./state/make-store-state.js"
import {AccessPayload} from "../../auth/types/auth-tokens.js"
import {makeStoreAllowance} from "./utils/make-store-allowance.js"
import {makeConnectSubmodel} from "./submodels/connect-submodel.js"
import {makeConnectService} from "../api/services/connect-service.js"
import {FlexStorage} from "../../../toolbox/flex-storage/types/flex-storage.js"
import {TriggerStripeConnectPopup, TriggerCheckoutPopup} from "../types/store-popups.js"

export function makeStoreModel(options: {
		appId: string
		storageForCache: FlexStorage
		connectService: Service<typeof makeConnectService>
		triggerStripeConnectPopup: TriggerStripeConnectPopup
		triggerCheckoutPopup: TriggerCheckoutPopup
	}) {

	const state = makeStoreState()
	const allowance = makeStoreAllowance(state)
	const connectSubmodel = makeConnectSubmodel({...options, state, allowance})

	return {
		state: state.readable,
		subscribe: state.subscribe,
		allowance,

		connectSubmodel,

		async updateAccessOp(op: Op<AccessPayload>) {
			state.writable.accessOp = op
			state.writable.connectStatusOp = ops.none()
			state.writable.connectDetailsOp = ops.none()
			await Promise.all([
				connectSubmodel.refresh(),
			])
		},
	}
}
