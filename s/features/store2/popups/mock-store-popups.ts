
import {StorePopups} from "../models/types.js"
import {MockStripeOperations} from "../stripe/types.js"

export function mockStorePopups({mockStripeOperations}: {
		mockStripeOperations: MockStripeOperations
	}): StorePopups {
	return {

		stripeLogin: <StorePopups["stripeLogin"]>(async() => {
			throw new Error("todo mock stripe login popup")
		}),

		stripeConnect: <StorePopups["stripeConnect"]>(async({
				stripeAccountId,
			}) => {
			await mockStripeOperations.linkStripeAccount(stripeAccountId)
		}),

		checkoutPaymentMethod: <StorePopups["checkoutPaymentMethod"]>(async({
				stripeAccountId,
				stripeSessionId,
			}) => {
			await mockStripeOperations.updatePaymentMethod(
				stripeAccountId,
				stripeSessionId,
			)
		}),

		checkoutSubscription: <StorePopups["checkoutSubscription"]>(async({
				stripeAccountId,
				stripeSessionId,
			}) => {
			await mockStripeOperations.checkoutSubscriptionTier(
				stripeAccountId,
				stripeSessionId
			)
		}),
	}
}
