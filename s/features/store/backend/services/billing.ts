
import * as renraku from "renraku"

import {StoreServiceOptions} from "../types/options.js"
import {PaymentMethod} from "../../isomorphic/concepts.js"
import {derivePaymentMethod} from "../utils/derive-payment-method.js"
import {makeStripePopupSpec} from "../../popups/make-stripe-popup-spec.js"
import {getStripeDefaultPaymentMethod} from "../utils/get-stripe-default-payment-method.js"

export const makeBillingService = (options: StoreServiceOptions) =>
renraku
.service()
.policy(options.storePolicies.customer)
.expose(auth => ({

	async getDefaultPaymentMethod(): Promise<PaymentMethod> {
		return derivePaymentMethod(await getStripeDefaultPaymentMethod(auth))
	},

	async generateCustomerPortalLink() {
		const {popupId, return_url} =
			makeStripePopupSpec
				.openCustomerPortal(options)

		const session =
			await auth
				.stripeLiaisonAccount
				.billingPortal
				.create({
					customer: auth.stripeCustomerId,
					return_url
				})

		return {
			popupId,
			customer: session.customer,
			stripeSessionUrl: session.url,
			stripeAccountId: auth.stripeAccountId
		}
	},
}))
