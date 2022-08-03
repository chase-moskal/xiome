
import {StoreServices} from "./types.js"
import {Op} from "../../../framework/ops.js"
import {StripePopups} from "../popups/types.js"
import {AccessPayload} from "../../auth/types/auth-tokens.js"
import {makeStoreStateSystem} from "./state/store-state-system.js"
import {setupStoreSubmodels} from "./utils/setup-store-submodels.js"
import {setupLogicForInitAndLoading} from "./utils/setup-logic-for-init-and-loading.js"

export function makeStoreModel(options: {
		services: StoreServices
		stripePopups: StripePopups
		reauthorize: () => Promise<void>
	}) {

	const stateSystem = makeStoreStateSystem()

	const submodels = setupStoreSubmodels({
		...options,
		stateSystem,
		reloadStore: async() => initLogic.load(),
	})

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
