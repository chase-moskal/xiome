
import {Service} from "../../../../types/service.js"
import {stripeAccountsTopic} from "../../topics/stripe-accounts-topic.js"

export function bankModel({stripeAccountsService, triggerBankPopup}: {
			stripeAccountsService: Service<typeof stripeAccountsTopic>
			triggerBankPopup: ({stripeAccountLink}: {
				stripeAccountLink: string
			}) => Promise<void>
		}) {

	return {
		async getStripeAccountDetails(appId: string) {
			return stripeAccountsService.getStripeAccountDetails({appId})
		},
		async setupStripeAccountPopup(appId: string) {
			const {stripeAccountLink} = await stripeAccountsService.createAccountPopup({appId})
			await triggerBankPopup({stripeAccountLink})
		},
	}
}
