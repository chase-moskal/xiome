
import {Stripe} from "stripe"
import {FlexibleRow} from "./rows/custom-db/flexible-row.js"
import * as dbmage from "dbmage"

export type MockStripeSchema = {
	prices: Partial<Stripe.Price>
	accounts: Partial<Stripe.Account>
	products: Partial<Stripe.Product>
	customers: Partial<Stripe.Customer>
	setupIntents: Partial<Stripe.SetupIntent>
	subscriptions: Partial<Stripe.Subscription>
	paymentMethods: Partial<Stripe.PaymentMethod>
	checkoutSessions: Partial<Stripe.Checkout.Session>
}

export type MockStripeTables = {
	[P in keyof MockStripeSchema]: dbmage.Table<FlexibleRow<MockStripeSchema[P]>>
}

export type MockStripeShape = dbmage.AsShape<{
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
