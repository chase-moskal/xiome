
import * as renraku from "renraku"

import {PaymentMethod} from "../../isomorphic/concepts.js"
import {StoreServiceOptions} from "../types/options.js"
import {makeStripePopupSpec} from "../../popups/make-stripe-popup-spec.js"
import {derivePaymentMethod} from "../utils/derive-payment-method.js"
import {stripeClientReferenceId} from "../stripe/utils/stripe-client-reference-id.js"
import {getStripeDefaultPaymentMethod} from "../utils/get-stripe-default-payment-method.js"

export const makeBillingService = (
	options: StoreServiceOptions
) => renraku.service()

.policy(options.storePolicies.storeCustomerPolicy)

.expose(auth => ({

	async checkoutPaymentMethod() {
		const {popupId, ...urls} = makeStripePopupSpec.checkout(options)

		const session = await auth
			.stripeLiaisonAccount
			.checkout
			.sessions
			.create({
				...urls,
				mode: "setup",
				payment_method_types: ["card"],
				customer: auth.stripeCustomerId,
				client_reference_id: stripeClientReferenceId.build({
					appId: auth.access.appId,
					userId: auth.access.user.userId,
				}),
			})

		return {
			popupId,
			stripeAccountId: auth.stripeAccountId,
			stripeSessionId: session.id,
			stripeSessionUrl: session.url,
		}
	},

	async getPaymentMethodDetails(): Promise<PaymentMethod> {
		return derivePaymentMethod(await getStripeDefaultPaymentMethod(auth))
	},

	async disconnectPaymentMethod() {
		const stripePaymentMethod = await getStripeDefaultPaymentMethod(auth)
		if (stripePaymentMethod) {
			await auth
				.stripeLiaisonAccount
				.paymentMethods
				.detach(stripePaymentMethod.id)
		}
	},

	async generateCustomerPortalLink() {
		const {popupId, return_url} = makeStripePopupSpec.openCustomerPortal(options)
		const session = await auth
			.stripeLiaisonAccount
			.billingPortal
			.create({
				customer: auth.stripeCustomerId,
				return_url
			})
		return {
			popupId,
			customerPortalLink: session.url
		}
	},
}))
