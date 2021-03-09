
import {Service} from "../../../../types/service.js"
import {TriggerBankPopup} from "./types/trigger-bank-popup.js"
import {stripeAccountsTopic} from "../../topics/stripe-accounts-topic.js"

export function bankModel({stripeAccountsService, triggerBankPopup}: {
			stripeAccountsService: Service<typeof stripeAccountsTopic>
			triggerBankPopup: TriggerBankPopup
		}) {

	return {
		async getStripeAccountDetails(appId: string) {
			return stripeAccountsService.getStripeAccountDetails({appId})
		},
		async setupStripeAccountPopup(appId: string) {
			const {stripeAccountId, stripeAccountSetupLink} = await stripeAccountsService.createAccountPopup({appId})
			await triggerBankPopup({stripeAccountId, stripeAccountSetupLink})
		},
	}
}
