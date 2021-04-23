
import {MockStripeOperations} from "../../../../../features/store/stripe2/types/mock-stripe-operations.js"
import {TriggerBankPopup} from "../../../../../features/store/model/shares/types/trigger-bank-popup.js"

export function mockPopups({mockStripeOperations}: {
		mockStripeOperations: MockStripeOperations
	}) {
	return {

		triggerBankPopup: <TriggerBankPopup>(async({stripeAccountId}) => {
			await mockStripeOperations.linkBankWithExistingStripeAccount(stripeAccountId)
		}),
	}
}
