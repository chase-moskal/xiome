
import {MockStripeOperations} from "../../../../../features/store/stripe/types/mock-stripe-operations.js"
import {TriggerStripeConnectPopup, TriggerCheckoutPopup} from "../../../../../features/store/types/store-popups.js"

export function mockPopups({mockStripeOperations}: {
		mockStripeOperations: MockStripeOperations
	}) {
	return {

		triggerStripeConnectPopup: <TriggerStripeConnectPopup>(async({stripeAccountId}) => {
			await mockStripeOperations.linkStripeAccount(stripeAccountId)
		}),

		triggerCheckoutPopup: <TriggerCheckoutPopup>(async({stripeAccountId}) => {
			console.log("")
		}),
	}
}
