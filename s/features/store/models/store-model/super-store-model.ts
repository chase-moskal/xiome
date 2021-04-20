
import {storeCore} from "./core/store-core.js"
import {AccessPayload} from "../../../auth/types/tokens/access-payload.js"
import {subscriptionPlanningShare} from "./shares/subscription-planning/subscription-planning-share.js"

export function altStoreModel() {
	const core = storeCore()
	const {watch, actions} = core

	const shares = {
		subscriptionPlanning: subscriptionPlanningShare(core),
	}

	return {
		watch,
		shares,
		async accessChange(access: AccessPayload) {
			actions.setAccess(access)
			await shares.subscriptionPlanning.accessChange()
		}
	}
}
