
import {Stripe} from "stripe"
import {FlexibleRow} from "./rows/custom-db/flexible-row.js"
import * as dbproxy from "../../../../../../toolbox/dbproxy/dbproxy.js"

export type MockStripeSchema = {
	prices: Stripe.Price
	accounts: Stripe.Account
	products: Stripe.Product
	customers: Stripe.Customer
	setupIntents: Stripe.SetupIntent
	subscriptions: Stripe.Subscription
	paymentMethods: Stripe.PaymentMethod
	checkoutSessions: Stripe.Checkout.Session
}

export type MockStripeTables = {
	[P in keyof MockStripeSchema]: dbproxy.Table<FlexibleRow<MockStripeSchema[P]>>
}

export type MockStripeShape = dbproxy.AsShape<{
	prices: boolean
	accounts: boolean
	products: boolean
	customers: boolean
	setupIntents: boolean
	subscriptions: boolean
	paymentMethods: boolean
	checkoutSessions: boolean
}>

export const mockStripeShape: MockStripeShape = {
	prices: true,
	accounts: true,
	products: true,
	customers: true,
	setupIntents: true,
	subscriptions: true,
	paymentMethods: true,
	checkoutSessions: true,
}
