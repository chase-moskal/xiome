
import {StorePopups, StoreServices} from "./types.js"
import {setupStoreState} from "./utils/setup-store-state.js"
import {setupStoreSubmodels} from "./utils/setup-store-submodels.js"
import {setupLogicForInitAndLoading} from "./utils/setup-logic-for-init-and-loading.js"
import {Op} from "../../../framework/ops.js"
import {AccessPayload} from "../../auth/types/auth-tokens.js"

export function makeStoreModel(options: {
		services: StoreServices
		popups: StorePopups
		reauthorize: () => Promise<void>
	}) {

	const stateDetails = setupStoreState()

	const submodels = setupStoreSubmodels({
		...options,
		stateDetails,
		reloadStore: async() => initLogic.load(),
	})

	const initLogic = setupLogicForInitAndLoading({
		stateDetails,
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
		async updateAccessOp(op: Op<AccessPayload>) {
			stateDetails.snap.state.user.accessOp = op
			await initLogic.refresh()
		},
	}
}
