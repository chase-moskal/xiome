
import {Stripe} from "stripe"
import {stripeAttempt} from "./helpers/stripe-attempt.js"

export function makeStripeLiaison({stripe}: {stripe: Stripe}) {
	return {

		accounts: stripeAttempt({
			async create(params: Stripe.AccountCreateParams) {
				return stripe.accounts.create(params)
			},
			async retrieve(id: string) {
				return stripe.accounts.retrieve(id)
			},
			async createLoginLink(id: string) {
				return stripe.accounts.createLoginLink(id)
			},
		}),

		accountLinks: stripeAttempt({
			async create(params: Stripe.AccountLinkCreateParams) {
				return stripe.accountLinks.create(params)
			},
		}),

		account(stripeAccount: string) {
			const connection = {stripeAccount}
			return {
				billingPortal: stripeAttempt({
					async create(params: Stripe.BillingPortal.SessionCreateParams) {
						return stripe.billingPortal.sessions.create(params, connection)
					}
				}),
				customers: stripeAttempt({
					async create(params: Stripe.CustomerCreateParams) {
						return stripe.customers.create(params, connection)
						// for testing timelines with stripe test clocks
						// return stripe.customers.create({...params, test_clock: "clock_1LmnQM2ePX2ph7RQrmN5ZCC9"}, connection)
					},
					async retrieve(id: string) {
						return stripe.customers.retrieve(id, connection)
					},
					async update(id: string, params: Stripe.CustomerUpdateParams) {
						return stripe.customers.update(id, params, connection)
					},
					async listPaymentMethods(customer: string, params: Stripe.CustomerListPaymentMethodsParams) {
						return stripe.customers.listPaymentMethods(customer, params, connection)
					},
				}),
				products: stripeAttempt({
					async create(params: Stripe.ProductCreateParams) {
						return stripe.products.create(params, connection)
					},
					async retrieve(id: string) {
						return stripe.products.retrieve(id, connection)
					},
					async update(id: string, params: Stripe.ProductUpdateParams) {
						return stripe.products.update(id, params, connection)
					},
				}),
				prices: stripeAttempt({
					async list(params: Stripe.PriceListParams) {
						return stripe.prices.list(params, connection)
					},
					async create(params: Stripe.PriceCreateParams) {
						return stripe.prices.create(params, connection)
					},
					async retrieve(id: string) {
						return stripe.prices.retrieve(id, connection)
					},
					async update(id: string, params: Stripe.PriceUpdateParams) {
						return stripe.prices.update(id, params, connection)
					},
				}),
				paymentMethods: stripeAttempt({
					async create(params: Stripe.PaymentMethodCreateParams) {
						return stripe.paymentMethods.create(params, connection)
					},
					async retrieve(id: string) {
						return stripe.paymentMethods.retrieve(id, connection)
					},
					async detach(id: string) {
						return stripe.paymentMethods.detach(id, undefined, connection)
					},
				}),
				setupIntents: stripeAttempt({
					async retrieve(id: string) {
						return stripe.setupIntents.retrieve(id, connection)
					},
					async create(params: Stripe.SetupIntentCreateParams) {
						return stripe.setupIntents.create(params, connection)
					},
				}),
				paymentIntents: stripeAttempt({
					async retrieve(id: string) {
						return stripe.paymentIntents.retrieve(id, connection)
					},
					async create(params: Stripe.PaymentIntentCreateParams) {
						return stripe.paymentIntents.create(params, connection)
					},
				}),
				subscriptions: stripeAttempt({
					async list(params: Stripe.SubscriptionListParams) {
						return stripe.subscriptions.list(params, connection)
					},
					async create(params: Stripe.SubscriptionCreateParams) {
						return stripe.subscriptions.create(params, connection)
					},
					async retrieve(id: string) {
						return stripe.subscriptions.retrieve(id, connection)
					},
					async update(id: string, params: Stripe.SubscriptionUpdateParams) {
						return stripe.subscriptions.update(id, params, connection)
					},
				}),
				subscriptionItems: stripeAttempt({
					async del(id: string, params: Stripe.SubscriptionItemDeleteParams) {
						return stripe.subscriptionItems.del(id, params, connection)
					},
				}),
				checkout: {
					sessions: stripeAttempt({
						async create(params: Stripe.Checkout.SessionCreateParams) {
							return stripe.checkout.sessions.create(params, connection)
						},
					}),
				},
			}
		}
	}
}
