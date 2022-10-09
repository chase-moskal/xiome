
import {Row} from "dbmage"
import {Stripe} from "stripe"
import * as dbmage from "dbmage"

export type FlexibleRow<X> = X & Row

export type MockAccount = FlexibleRow<{
	id: string
	email: string
	charges_enabled: boolean
	payouts_enabled: boolean
	details_submitted: boolean
} & Partial<Stripe.Account>>

export type MockCustomer = FlexibleRow<{
	id: string
} & Partial<Stripe.Customer>>

export type MockPaymentMethod = FlexibleRow<{
	id: string
	card: Stripe.PaymentMethod.Card
} & Partial<Stripe.PaymentMethod>>

export type MockSetupIntent = FlexibleRow<{
	id: string
	customer: string
	payment_method: string
	metadata: {
		subscription_id: string
	}
} & Partial<Stripe.SetupIntent>>

export type MockSubscriptionItem = FlexibleRow<{} & Partial<Stripe.SubscriptionItem>>

export type MockSubscription = FlexibleRow<{
	id: string
	items: MockSubscriptionItem[]
	current_period_end: number
	cancel_at_period_end: boolean
	default_payment_method: string
	status: Stripe.Subscription.Status
} & Partial<Stripe.Subscription>>

///////

export type AccountingTables = {
	accounts: dbmage.Table<MockAccount>
}

export type ConnectedTables = {
	customers: dbmage.Table<MockCustomer>
	setupIntents: dbmage.Table<MockSetupIntent>
	subscriptions: dbmage.Table<MockSubscription>
	paymentMethods: dbmage.Table<MockPaymentMethod>
}

export type MockStripeSchema = {
	prices: Partial<Stripe.Price>
	accounts: MockAccount
	invoices: Partial<Stripe.Invoice>
	products: Partial<Stripe.Product>
	customers: Partial<Stripe.Customer>
	setupIntents: Partial<Stripe.SetupIntent>
	subscriptions: Partial<Stripe.Subscription>
	paymentMethods: Partial<Stripe.PaymentMethod>
	paymentIntents: Partial<Stripe.PaymentIntent>
	checkoutSessions: Partial<Stripe.Checkout.Session>
}

export type MockStripeTables = {
	[P in keyof MockStripeSchema]: dbmage.Table<FlexibleRow<MockStripeSchema[P]>>
}

export type MetaDataTables = dbmage.SchemaToTables<{
	paymentMethodMetaData: {
			id: string;
			isFailing: boolean;
	};
}>

export type MockStripeShape = dbmage.AsShape<{
	prices: boolean
	accounts: boolean
	invoices: boolean
	products: boolean
	customers: boolean
	setupIntents: boolean
	subscriptions: boolean
	paymentMethods: boolean
	paymentIntents: boolean
	checkoutSessions: boolean
}>

export const mockStripeShape: MockStripeShape = {
	prices: true,
	accounts: true,
	invoices: true,
	products: true,
	customers: true,
	setupIntents: true,
	subscriptions: true,
	paymentMethods: true,
	paymentIntents: true,
	checkoutSessions: true,
}
