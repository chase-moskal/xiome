
import {storeCore} from "../core/store-core.js"
import {TriggerBankPopup} from "../types/popups.js"
import {Service} from "../../../../types/service.js"
import {makeStripeConnectService} from "../../api/services/stripe-connect-service.js"

export function bankShare({
		core: {state},
		stripeAccountsService,
		triggerBankPopup,
	}: {
		core: ReturnType<typeof storeCore>
		stripeAccountsService: Service<typeof makeStripeConnectService>
		triggerBankPopup: TriggerBankPopup
	}) {

	return {
		get access() {
			return state.access
		},
		async getStripeAccountDetails() {
			return stripeAccountsService.getConnectDetails()
		},
		async setupStripeAccount() {
			await triggerBankPopup(
				await stripeAccountsService.generateConnectSetupLink()
			)
		},
	}
}
