
import * as renraku from "renraku"

import {StoreServiceOptions} from "../types.js"
import {PaymentMethod} from "../../types/store-concepts.js"
import {derivePaymentMethod} from "./helpers/derive-payment-method.js"
import {makeStripePopupSpec} from "../../popups/make-stripe-popup-spec.js"
import {getStripePaymentMethod} from "./helpers/get-stripe-payment-method.js"
import {stripeClientReferenceId} from "../../stripe/utils/stripe-client-reference-id.js"

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
		return derivePaymentMethod(await getStripePaymentMethod(auth))
	},

	async disconnectPaymentMethod() {
		const stripePaymentMethod = await getStripePaymentMethod(auth)
		if (stripePaymentMethod) {
			await auth
				.stripeLiaisonAccount
				.paymentMethods
				.detach(stripePaymentMethod.id)
		}
	},
}))
