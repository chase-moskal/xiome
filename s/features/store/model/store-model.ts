
import {storeCore} from "./core/store-core.js"
import {bankShare} from "./shares/bank-share.js"
import {Service} from "../../../types/service.js"
import {ecommerceShare} from "./shares/ecommerce-share.js"
import {AccessPayload} from "../../auth2/types/auth-tokens.js"
import {TriggerBankPopup} from "./shares/types/trigger-bank-popup.js"
import {makeShopkeepingService} from "../api/services/shopkeeping-service.js"
import {FlexStorage} from "../../../toolbox/flex-storage/types/flex-storage.js"
import {subscriptionPlanningShare} from "./shares/subscription-planning-share.js"
import {makeStatusCheckerService} from "../api/services/status-checker-service.js"
import {makeStatusTogglerService} from "../api/services/status-toggler-service.js"
import {makeStripeConnectService} from "../api/services/stripe-connect-service.js"

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
		shopkeepingService: Service<typeof makeShopkeepingService>
		statusCheckerService: Service<typeof makeStatusCheckerService>
		statusTogglerService: Service<typeof makeStatusTogglerService>
		stripeAccountsService: Service<typeof makeStripeConnectService>
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
