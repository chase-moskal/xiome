
// import {MockStripeOperations} from "../../../../../features/store/stripe/types/mock-stripe-operations.js"
// import {TriggerStripeConnectPopup, TriggerCheckoutPopup} from "../../../../../features/store/types/store-popups.js"

// export function mockPopups({mockStripeOperations}: {
// 		mockStripeOperations: MockStripeOperations
// 	}) {
// 	return {

// 		triggerStripeConnectPopup: <TriggerStripeConnectPopup>(async({
// 				stripeAccountId,
// 			}) => {
// 			await mockStripeOperations.linkStripeAccount(stripeAccountId)
// 		}),

// 		triggerCheckoutPaymentMethodPopup: <TriggerCheckoutPopup>(async({
// 				stripeAccountId,
// 				stripeSessionId,
// 			}) => {
// 			await mockStripeOperations.updatePaymentMethod(
// 				stripeAccountId,
// 				stripeSessionId,
// 			)
// 		}),

// 		triggerCheckoutSubscriptionPopup: <TriggerCheckoutPopup>(async({
// 				stripeAccountId,
// 				stripeSessionId,
// 			}) => {
// 			await mockStripeOperations.checkoutSubscriptionTier(
// 				stripeAccountId,
// 				stripeSessionId
// 			)
// 		}),
// 	}
// }
