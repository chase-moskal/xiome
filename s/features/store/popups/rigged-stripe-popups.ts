
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
			if (rig.stripeAccountFate === "complete")
				await mockStripeOperations.linkStripeAccount(stripeAccountId)
			else
				await mockStripeOperations.linkStripeAccountThatIsIncomplete(stripeAccountId)
			return {popupId}
		},

		async checkoutSubscription({popupId, stripeAccountId, stripeSessionId}) {
			await mockStripeOperations.checkoutSubscriptionTier(
				stripeAccountId,
				stripeSessionId
			)
			return {popupId}
		},

		async openStoreCustomerPortal({
			popupId, stripeAccountId, customer
		}) {
			if(rig.customerPortalAction === "link successful payment method"){
				await mockStripeOperations.createNewDefaultPaymentMethod({
					stripeAccountId, customer, isFailing: false
				})
			}
			else if (rig.customerPortalAction === "link failing payment method"){
				await mockStripeOperations.createNewDefaultPaymentMethod({
					stripeAccountId, customer, isFailing: true
				})
			}
			else if (rig.customerPortalAction === "detach payment method"){
				await mockStripeOperations.removeAllPaymentMethods(customer)
			}
			return {popupId}
		},
	}
}
