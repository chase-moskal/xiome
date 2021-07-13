
import {storeCore} from "./core/store-core.js"
import {bankShare} from "./shares/bank-share.js"
import {Service} from "../../../types/service.js"
import {ecommerceShare} from "./shares/ecommerce-share.js"
import {shopkeepingTopic} from "../topics/shopkeeping-topic.js"
import {statusCheckerTopic} from "../topics/status-checker-topic.js"
import {statusTogglerTopic} from "../topics/status-toggler-topic.js"
import {stripeConnectTopic} from "../topics/stripe-connect-topic.js"
import {TriggerBankPopup} from "./shares/types/trigger-bank-popup.js"
import {AccessPayload} from "../../auth/types/tokens/access-payload.js"
import {FlexStorage} from "../../../toolbox/flex-storage/types/flex-storage.js"
import {subscriptionPlanningShare} from "./shares/subscription-planning-share.js"

export function makeStoreModel({
		appId,
		storage,
		shopkeepingService,
		statusCheckerService,
		statusTogglerService,
		stripeAccountsService,
		triggerBankPopup,
	}: {
		appId: string
		storage: FlexStorage
		shopkeepingService: Service<typeof shopkeepingTopic>
		statusCheckerService: Service<typeof statusCheckerTopic>
		statusTogglerService: Service<typeof statusTogglerTopic>
		stripeAccountsService: Service<typeof stripeConnectTopic>
		triggerBankPopup: TriggerBankPopup
	}) {

	const core = storeCore()
	const {track, actions} = core

	const shares = {
		subscriptionPlanning: subscriptionPlanningShare({core, shopkeepingService}),
		ecommerce: ecommerceShare({core, appId, storage, statusTogglerService, statusCheckerService}),
		bank: bankShare({core, stripeAccountsService, triggerBankPopup})
	}

	return {
		track,
		shares,
		async accessChange(access: AccessPayload) {
			actions.setAccess(access)
			await shares.subscriptionPlanning.accessChange()
		}
	}
}
