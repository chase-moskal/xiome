
import {Op} from "../../../../framework/ops.js"
import {StripePopups} from "../../popups/types.js"
import {StoreServices} from "../types.js"
import {makeStoreStateSystem} from "../state.js"
import {AccessPayload} from "../../../auth/types/auth-tokens.js"
import {makeConnectSubmodel} from "./submodels/connect.js"
import {makeBillingSubmodel} from "./submodels/billing.js"
import {makeSubscriptionsSubmodel} from "./submodels/subscriptions.js"
import {setupLogicForInitAndLoading} from "./utils/setup-logic-for-init-and-loading.js"

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
