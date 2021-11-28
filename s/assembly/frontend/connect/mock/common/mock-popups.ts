
import {MockStripeOperations} from "../../../../../features/store/stripe2/types/mock-stripe-operations.js"
import {TriggerCheckoutPopup, TriggerBankPopup} from "../../../../../features/store/model/types/popups.js"

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
