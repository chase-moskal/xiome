
import {Stripe} from "stripe"
import {LiaisonConnectedOptions} from "../types/liaison-connected-options.js"

export function stripeLiaisonConcept({stripe, connection}: LiaisonConnectedOptions) {
	return {
		customers: {
			async create(params: Stripe.CustomerCreateParams) {
				return stripe.customers.create(params, connection)
			},
			async retrieve(id: string) {
				return stripe.customers.retrieve(id, connection)
			},
			async update(id: string, params: Stripe.CustomerUpdateParams) {
				return stripe.customers.update(id, params, connection)
			},
		},
		products: {
			async create(params: Stripe.ProductCreateParams) {
				return stripe.products.create(params, connection)
			},
			async retrieve(id: string) {
				return stripe.products.retrieve(id, connection)
			},
			async update(id: string, params: Stripe.ProductUpdateParams) {
				return stripe.products.update(id, params, connection)
			},
		},
		prices: {
			async create(params: Stripe.PriceCreateParams) {
				return stripe.prices.create(params, connection)
			},
			async retrieve(id: string) {
				return stripe.prices.retrieve(id, connection)
			},
			async update(id: string, params: Stripe.PriceUpdateParams) {
				return stripe.prices.update(id, params, connection)
			},
		},
		paymentMethods: {
			async retrieve(id: string) {
				return stripe.paymentMethods.retrieve(id, connection)
			},
		},
		setupIntents: {
			async retrieve(id: string) {
				return stripe.setupIntents.retrieve(id, connection)
			},
		},
		subscriptions: {
			async retrieve(id: string) {
				return stripe.subscriptions.retrieve(id, connection)
			},
			async update(id: string, params: Stripe.SubscriptionUpdateParams) {
				return stripe.subscriptions.update(id, params, connection)
			},
		},
		checkout: {
			sessions: {
				async create(params: Stripe.Checkout.SessionCreateParams) {
					return stripe.checkout.sessions.create(params, connection)
				},
			},
		},
	}
}
