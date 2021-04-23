
import {storeCore} from "./core/store-core.js"
import {Service} from "../../../../types/service.js"
import {shopkeepingTopic} from "../../topics/shopkeeping-topic.js"
import {statusCheckerTopic} from "../../topics/status-checker-topic.js"
import {statusTogglerTopic} from "../../topics/status-toggler-topic.js"
import {AccessPayload} from "../../../auth/types/tokens/access-payload.js"
import {FlexStorage} from "../../../../toolbox/flex-storage/types/flex-storage.js"
import {subscriptionPlanningShare} from "./shares/subscription-planning-share.js"
import {ecommerceShare} from "./shares/ecommerce-share.js"
import {TriggerBankPopup} from "../bank-manager/types/trigger-bank-popup.js"
import {stripeConnectTopic} from "../../topics/stripe-connect-topic.js"
import {bankShare} from "./shares/bank-share.js"

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
	const {watch, actions} = core

	const shares = {
		subscriptionPlanning: subscriptionPlanningShare({core, shopkeepingService}),
		ecommerce: ecommerceShare({appId, storage, core, statusTogglerService, statusCheckerService}),
		bank: bankShare({stripeAccountsService, triggerBankPopup})
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
