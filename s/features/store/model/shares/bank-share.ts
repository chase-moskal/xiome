
import {storeCore} from "../core/store-core.js"
import {Service} from "../../../../types/service.js"
import {TriggerBankPopup} from "./types/trigger-bank-popup.js"
import {stripeConnectTopic} from "../../topics/stripe-connect-topic.js"

export function bankShare({
		core: {state},
		stripeAccountsService,
		triggerBankPopup,
	}: {
		core: ReturnType<typeof storeCore>
		stripeAccountsService: Service<typeof stripeConnectTopic>
		triggerBankPopup: TriggerBankPopup
	}) {

	return {
		get access() {
			return state.access
		},
		async getStripeAccountDetails(id_app: string) {
			return stripeAccountsService.getConnectDetails({id_app})
		},
		async setupStripeAccount(id_app: string) {
			await triggerBankPopup(
				await stripeAccountsService.generateConnectSetupLink({id_app})
			)
		},
	}
}
