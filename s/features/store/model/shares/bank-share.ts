
import {storeCore} from "../core/store-core.js"
import {Service2} from "../../../../types/service2.js"
import {TriggerBankPopup} from "./types/trigger-bank-popup.js"
import {makeStripeConnectService} from "../../api/services/stripe-connect-service.js"

export function bankShare({
		core: {state},
		stripeAccountsService,
		triggerBankPopup,
	}: {
		core: ReturnType<typeof storeCore>
		stripeAccountsService: Service2<typeof makeStripeConnectService>
		triggerBankPopup: TriggerBankPopup
	}) {

	return {
		get access() {
			return state.access
		},
		async getStripeAccountDetails(appId: string) {
			return stripeAccountsService.getConnectDetails({appId})
		},
		async setupStripeAccount(appId: string) {
			await triggerBankPopup(
				await stripeAccountsService.generateConnectSetupLink({appId})
			)
		},
	}
}
