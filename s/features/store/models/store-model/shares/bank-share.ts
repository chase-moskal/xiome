
import {Service} from "../../../../../types/service.js"
import {stripeConnectTopic} from "../../../topics/stripe-connect-topic.js"
import {TriggerBankPopup} from "../../bank-manager/types/trigger-bank-popup.js"

export function bankShare({
		triggerBankPopup,
		stripeAccountsService,
	}: {
		stripeAccountsService: Service<typeof stripeConnectTopic>
		triggerBankPopup: TriggerBankPopup
	}) {

	return {
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
