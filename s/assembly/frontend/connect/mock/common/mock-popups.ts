
import {TriggerBankPopup} from "../../../../../features/store/models/bank-manager/types/trigger-bank-popup.js"
import {MockStripeOperations} from "../../../../../features/store/stripe/mocks/types/mock-stripe-operations.js"

export function mockPopups({mockStripeOperations}: {
		mockStripeOperations: MockStripeOperations
	}) {
	return {

		triggerBankPopup: <TriggerBankPopup>(async({stripeAccountId}) => {
			await mockStripeOperations.linkBankWithExistingStripeAccount(stripeAccountId)
		}),
	}
}
