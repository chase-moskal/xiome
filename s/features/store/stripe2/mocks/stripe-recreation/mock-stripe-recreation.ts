
import {Stripe} from "stripe"
import {Rando} from "../../../../../toolbox/get-rando.js"
import {SetupSubscriptionMetadata} from "../../liaison/types/setup-subscription-metadata.js"

export function mockStripeInitializers({rando}: {rando: Rando}) {
	const generateId = () => rando.randomId()

	return {
		sessionForSubscriptionPurchase({
				userId,
				customer,
				subscription,
			}: {
				userId: string
				customer: Stripe.Customer
				subscription: Stripe.Subscription
			}): Partial<Stripe.Checkout.Session> {
			return {
				id: generateId(),
				mode: "subscription",
				customer: customer.id,
				client_reference_id: userId,

				// TODO check modern technique in stripe docs
				subscription: subscription.id,
				line_items: undefined,
			}
		},
		sessionForSubscriptionUpdate({
				userId,
				customer,
				setupIntent,
				subscriptionId,
			}: {
				userId: string
				customer: Stripe.Customer
				subscriptionId: string
				setupIntent: Stripe.SetupIntent
			}): Partial<Stripe.Checkout.Session> {
			return {
				id: generateId(),
				mode: "setup",
				customer: customer.id,
				client_reference_id: userId,
				setup_intent: setupIntent.id,
				metadata: <SetupSubscriptionMetadata>{
					flow: "update-subscription",
					customer_id: customer.id,
					subscription_id: subscriptionId,
				},
			}
		},
		account(): Partial<Stripe.Account> {
			return {
				id: generateId(),
				email: "",
				type: "standard",
				charges_enabled: false,
				details_submitted: false,
				payouts_enabled: false,
			}
		},
		customer(): Partial<Stripe.Customer> {
			return {
				id: generateId(),
			}
		},
		paymentMethod(): Partial<Stripe.PaymentMethod> {
			return {
				id: generateId(),
				card: {
					brand: "FAKEVISA",
					country: "US",
					exp_year: 2020,
					exp_month: 10,
					last4: rando.randomSequence(4, [..."0123456789"]),
					description: "description",
					funding: "credit",
					checks: undefined,
					wallet: undefined,
					networks: undefined,
					three_d_secure_usage: undefined,
				},
			}
		},
		setupIntentForSubscription({customer, subscription, paymentMethod}: {
				customer: Partial<Stripe.Customer>
				subscription: Partial<Stripe.Subscription>
				paymentMethod: Partial<Stripe.PaymentMethod>
			}): Partial<Stripe.SetupIntent> {
			return {
				id: generateId(),
				customer: customer.id,
				payment_method: paymentMethod.id,
				metadata: {
					subscription_id: subscription.id
				},
			}
		},
		subscription({planId, customer, paymentMethod, timeframeEnd}: {
				planId: string
				customer: Stripe.Customer
				paymentMethod: Stripe.PaymentMethod
				timeframeEnd: number
			}): Partial<Stripe.Subscription> {
			return {
				id: generateId(),
				status: "active",

				// TODO fix this!
				// plan: {id: planId},
				
				customer: customer.id,
				cancel_at_period_end: false,
				current_period_end: timeframeEnd,
				default_payment_method: paymentMethod.id,
			}
		},
	}
}
