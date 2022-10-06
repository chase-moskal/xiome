
import {StripePopups} from "./types.js"
import {MockStoreRig} from "../testing/utils/mock-rig.js"
import {MockStripeOperations} from "../backend/stripe/types.js"

export function riggedStripePopups({rig, mockStripeOperations}: {
		rig: MockStoreRig
		mockStripeOperations: MockStripeOperations
	}): StripePopups {
	return {
	
		async connect({popupId, stripeAccountId}) {
			if (rig.stripeAccountFate === "complete") {
				await mockStripeOperations.linkStripeAccount(stripeAccountId)
				return {popupId, details: {status: "return"}}
			}
			else {
				await mockStripeOperations.linkStripeAccountThatIsIncomplete(stripeAccountId)
				return {popupId, details: {status: "return"}}
			}
		},

		async login({popupId, stripeAccountId}) {
			rig.stripeLoginCount += 1
			await mockStripeOperations.configureStripeAccount(
				stripeAccountId,
				rig.stripeAccountFate === "complete",
			)
			return {popupId}
		},

		async checkoutSubscription({popupId, stripeAccountId, stripeSessionId}) {
			await mockStripeOperations.checkoutSubscriptionTier(
				stripeAccountId,
				stripeSessionId
			)
			return {popupId}
		},

		async checkoutPaymentMethod({popupId, stripeAccountId, stripeSessionId}) {
			await mockStripeOperations.completePaymentMethodCheckout(stripeAccountId, stripeSessionId)
			return {popupId}
		},

		async openStoreCustomerPortal(popupId) {
			return {popupId}
		},
	}
}

// import {StorePopups} from "../models/types.js"
// import {MockStripeOperations} from "../stripe/types.js"
// import {MockStoreRig} from "../testing/parts/mock-rig.js"

// // TODO mock store popups that work in automated testing

// export function mockStorePopups({rig, mockStripeOperations}: {
// 		rig: MockStoreRig
// 		mockStripeOperations: MockStripeOperations
// 	}): StorePopups {
// 	return {

// 		stripeLogin: <StorePopups["stripeLogin"]>(async({
// 				stripeAccountId
// 			}) => {
// 			rig.stripeLoginCount += 1
// 			await mockStripeOperations.configureStripeAccount(
// 				stripeAccountId,
// 				rig.stripeAccountFate === "complete",
// 			)
// 		}),

// 		stripeConnect: <StorePopups["stripeConnect"]>(async({
// 				stripeAccountId,
// 			}) => {
// 			if (rig.stripeAccountFate === "complete")
// 				await mockStripeOperations
// 					.linkStripeAccount(stripeAccountId)
// 			else
// 				await mockStripeOperations
// 					.linkStripeAccountThatIsIncomplete(stripeAccountId)
// 		}),

// 		checkoutPaymentMethod: <StorePopups["checkoutPaymentMethod"]>(async({
// 				stripeAccountId,
// 				stripeSessionId,
// 			}) => {
// 			await mockStripeOperations.updatePaymentMethod(
// 				stripeAccountId,
// 				stripeSessionId,
// 			)
// 		}),

// 		checkoutSubscription: <StorePopups["checkoutSubscription"]>(async({
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
