
import {Service} from "../../../../types/service.js"
import {AccessPayload} from "../../../auth/types/tokens/access-payload.js"
import {stripeAccountsTopic} from "../../topics/stripe-accounts-topic.js"

export function bankModel({stripeAccountsService}: {
			stripeAccountsService: Service<typeof stripeAccountsTopic>
		}) {

	return {
		async getStripeAccountDetails(appId: string) {
			return stripeAccountsService.getStripeAccountDetails({appId})
		},
		async createStripeAccountPopup(appId: string) {
			return stripeAccountsService.createAccountPopup({appId})
		},
	}
}
