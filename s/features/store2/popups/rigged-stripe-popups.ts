
import {StripePopups} from "./types.js"
import {MockStripeOperations} from "../stripe/types.js"
import {MockStoreRig} from "../testing/parts/mock-rig.js"

export function riggedStripePopups({rig, mockStripeOperations}: {
		rig: MockStoreRig
		mockStripeOperations: MockStripeOperations
	}): StripePopups {
	return {
	
		async connect({popupId, stripeAccountId}) {
			if (rig.stripeAccountFate === "complete") {
				await mockStripeOperations.linkStripeAccount(stripeAccountId)
				return {popupId, status: "return"}
			}
			else {
				await mockStripeOperations.linkStripeAccountThatIsIncomplete(stripeAccountId)
				return {popupId, status: "return"}
			}
		},

		async login({stripeAccountId}) {
			rig.stripeLoginCount += 1
			await mockStripeOperations.configureStripeAccount(
				stripeAccountId,
				rig.stripeAccountFate === "complete",
			)
		},

		async checkout({popupId, stripeAccountId, stripeSessionId}) {
			await mockStripeOperations.checkoutSubscriptionTier(
				stripeAccountId,
				stripeSessionId
			)
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
