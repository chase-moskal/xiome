
import {Op} from "../../../framework/ops.js"
import {StoreServices} from "./model/types.js"
import {makeStoreStateSystem} from "./model/state.js"
import {StripePopups} from "../aspects/popups/types.js"
import {AccessPayload} from "../../auth/types/auth-tokens.js"
import {makeBillingSubmodel} from "../aspects/billing/submodel.js"
import {makeConnectSubmodel} from "../aspects/connect/submodel.js"
import {makeSubscriptionsSubmodel} from "../aspects/subscriptions/submodel.js"
import {setupLogicForInitAndLoading} from "./model/setup-logic-for-init-and-loading.js"

export function makeStoreModel(options: {
		services: StoreServices
		stripePopups: StripePopups
		reauthorize: () => Promise<void>
	}) {

	const stateSystem = makeStoreStateSystem()

	const submodelOptions = {
		...options,
		stateSystem,
		reloadStore: async() => initLogic.load(),
	}

	const submodels = {
		subscriptions: makeSubscriptionsSubmodel(submodelOptions),
		billing: makeBillingSubmodel(submodelOptions),
		connect: makeConnectSubmodel(submodelOptions),
	}

	const initLogic = setupLogicForInitAndLoading({
		state: stateSystem.state,
		loadStore: async() => {
			await submodels.connect.load()
			await Promise.all([
				submodels.billing.load(),
				submodels.subscriptions.load(),
			])
		}
	})

	return {
		...stateSystem,
		...submodels,
		...initLogic,
		async updateAccessOp(op: Op<AccessPayload>) {
			stateSystem.snap.state.user.accessOp = op
			await initLogic.refresh()
		},
	}
}
