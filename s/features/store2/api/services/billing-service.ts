
import * as renraku from "renraku"
import {makeStripePopupSpec} from "../../popups/make-stripe-popup-spec.js"
import {CardClues} from "../../stripe/liaison/types.js"
import {stripeClientReferenceId} from "../../stripe/utils/stripe-client-reference-id.js"
import {PaymentMethod} from "../../types/store-concepts.js"

import {StoreServiceOptions} from "../types.js"
import {getStripePaymentMethod} from "./helpers/get-stripe-payment-method.js"


export const makeBillingService = (
	options: StoreServiceOptions
) => renraku.service()

.policy(options.storePolicies.storeCustomerPolicy)

.expose(auth => ({

	async checkoutPaymentMethod() {
		const {popupId, ...urls} = makeStripePopupSpec.checkout(options)
		const session = await auth.stripeLiaisonAccount.checkout.sessions.create({
			payment_method_types: ["card"],
			mode: "setup",
			customer: auth.stripeCustomerId,
			client_reference_id: stripeClientReferenceId.build({
				appId: auth.access.appId,
				userId: auth.access.user.userId,
			}),
			...urls,
		})
		return {
			popupId,
			stripeAccountId: auth.stripeAccountId,
			stripeSessionId: session.id,
			stripeSessionUrl: session.url,
		}
	},

	async getPaymentMethodDetails(): Promise<PaymentMethod> {
		const stripePaymentMethod = await getStripePaymentMethod(auth)
		return stripePaymentMethod
			? {
				cardClues: <CardClues>{
					brand: stripePaymentMethod.card.brand,
					country: stripePaymentMethod.card.country,
					expireMonth: stripePaymentMethod.card.exp_month,
					expireYear: stripePaymentMethod.card.exp_year,
					last4: stripePaymentMethod.card.last4,
				}
			}
			: undefined
	},

	async disconnectPaymentMethod() {
		const stripePaymentMethod = await getStripePaymentMethod(auth)
		if (stripePaymentMethod) {
			await auth.stripeLiaisonAccount.paymentMethods.detach(
				stripePaymentMethod.id
			)
		}
	},
}))
