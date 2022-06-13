
// import {TriggerCheckoutPopup, TriggerStripeConnectPopup} from "../../../../features/store/types/store-popups.js"
// import {openBankPopup} from "../../../../features/store/popups/bank/open-bank-popup.js"

// export function systemPopups({popupsBase}: {popupsBase: string}) {
// 	return {

// 		triggerStripeConnectPopup: <TriggerStripeConnectPopup>(async({
// 				stripeAccountId,
// 				stripeAccountSetupLink,
// 			}) => {
// 			const result = openBankPopup({
// 				popupLink: `${popupsBase}/bank`,
// 				stripeAccountId,
// 				stripeAccountSetupLink,
// 			})
// 			return result.promisedPayload
// 		}),

// 		triggerCheckoutPaymentMethodPopup: <TriggerCheckoutPopup>(async({
// 				stripeAccountId,
// 				stripeSessionId,
// 				stripeSessionUrl,
// 			}) => {
// 			throw new Error("todo checkout payment popup")
// 		}),

// 		triggerCheckoutSubscriptionPopup: <TriggerCheckoutPopup>(async({
// 				stripeAccountId,
// 				stripeSessionId,
// 				stripeSessionUrl,
// 			}) => {
// 			throw new Error("todo checkout subscription popup")
// 		}),
// 	}
// }
