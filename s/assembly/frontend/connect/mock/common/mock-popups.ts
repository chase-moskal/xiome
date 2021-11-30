
import {MockStripeOperations} from "../../../../../features/store/stripe/types/mock-stripe-operations.js"
import {TriggerBankPopup, TriggerCheckoutPopup} from "../../../../../features/store/types/store-popups.js"

export function mockPopups({mockStripeOperations}: {
		mockStripeOperations: MockStripeOperations
	}) {
	return {

		triggerBankPopup: <TriggerBankPopup>(async({stripeAccountId}) => {
			await mockStripeOperations.linkBankWithExistingStripeAccount(stripeAccountId)
		}),

		triggerCheckoutPopup: <TriggerCheckoutPopup>(async({stripeAccountId}) => {
			console.log("")
		}),
	}
}
