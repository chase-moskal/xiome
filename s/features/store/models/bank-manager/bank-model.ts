
import {Service} from "../../../../types/service.js"
import {TriggerBankPopup} from "./types/trigger-bank-popup.js"
import {stripeConnectTopic} from "../../topics/stripe-connect-topic.js"

export function bankModel({stripeAccountsService, triggerBankPopup}: {
			stripeAccountsService: Service<typeof stripeConnectTopic>
			triggerBankPopup: TriggerBankPopup
		}) {

	return {
		async getStripeAccountDetails(appId: string) {
			return stripeAccountsService.getConnectDetails({appId})
		},
		async setupStripeAccount(appId: string) {
			const {stripeAccountId, stripeAccountSetupLink} = await stripeAccountsService.generateConnectSetupLink({appId})
			await triggerBankPopup({stripeAccountId, stripeAccountSetupLink})
		},
	}
}
