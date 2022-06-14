
import Stripe from "stripe"
import {Rando, find, and} from "dbmage"

import {SetupSubscriptionMetadata} from "../../types.js"
import {day} from "../../../../../../toolbox/goodtimes/times.js"
import {MockStripeTables, MockAccount, MockCustomer, MockSetupIntent, MockSubscription, MockPaymentMethod} from "../tables/types.js"
import {stripeClientReferenceId} from "../../../utils/stripe-client-reference-id.js"

export function mockLiaisonUtils({rando, tables}: {
		rando: Rando
		tables: MockStripeTables
	}) {

	const generateId = () => rando.randomId()

	// TODO -- eliminate all procedures? just use dbmage directly?
	const procedures = {
		async insertAccount(account: MockAccount) {
			await tables.accounts.create(account)
		},
		async insertCustomer(customer: MockCustomer) {
			await tables.customers.create(customer)
		},
		async insertSetupIntent(setupIntent: MockSetupIntent) {
			await tables.setupIntents.create(setupIntent)
		},
		async insertSubscription(subscription: MockSubscription) {
			await tables.subscriptions.create(subscription)
		},
		async insertPaymentMethod(paymentMethod: MockPaymentMethod) {
			await tables.paymentMethods.create(paymentMethod)
		},
		async fetchAccount(id: string) {
			return tables.accounts.readOne(find({id}))
		},
		async fetchCustomer(id: string) {
			return tables.customers.readOne({conditions: and({equal: {id}})})
		},
		async fetchSubscription(id: string) {
			return tables.subscriptions.readOne({conditions: and({equal: {id}})})
		},
		async fetchPaymentMethod(id: string) {
			return tables.paymentMethods.readOne({conditions: and({equal: {id}})})
		},
		async fetchSetupIntent(id: string) {
			return tables.setupIntents.readOne({conditions: and({equal: {id}})})
		},
		async updateCustomer(customerId: string, customer: Partial<MockCustomer>) {
			return tables.customers.update({
				...find({id: customerId}),
				write: customer,
			})
		},
	}

	const initializers = {

		sessionForSubscriptionPurchase({
				appId,
				userId,
				customer,
				subscription,
			}: {
				appId: string
				userId: string
				customer: MockCustomer
				subscription: MockSubscription
			}): Partial<Stripe.Checkout.Session> {
			return {
				id: generateId().toString(),
				mode: "subscription",
				customer: customer.id,
				client_reference_id: stripeClientReferenceId.build({
					appId,
					userId,
				}),
				subscription: subscription.id,
			}
		},

		sessionForSubscriptionUpdate({
				appId,
				userId,
				customer,
				setupIntent,
				subscriptionId,
			}: {
				appId: string
				userId: string
				customer: MockCustomer
				subscriptionId: string
				setupIntent: MockSetupIntent
			}): Partial<Stripe.Checkout.Session> {
			return {
				id: generateId().toString(),
				mode: "setup",
				customer: customer.id,
				client_reference_id: stripeClientReferenceId.build({
					appId,
					userId,
				}),
				setup_intent: setupIntent.id,
				metadata: <SetupSubscriptionMetadata>{
					flow: "update-subscription",
					customer_id: customer.id,
					subscription_id: subscriptionId,
				},
			}
		},

		async account(): Promise<MockAccount> {
			const account: Stripe.Account = {
				id: generateId().toString(),
				email: "",
				type: "standard",
				charges_enabled: false,
				details_submitted: false,
				payouts_enabled: false,

				business_profile: undefined,
				business_type: undefined,
				country: undefined,
				default_currency: undefined,
				object: undefined,
				settings: undefined,
			}
			await procedures.insertAccount(<MockAccount>account)
			return <MockAccount>account
		},

		async customer(): Promise<MockCustomer> {
			const customer = {
				id: generateId().toString()
			}
			await procedures.insertCustomer(customer)
			return customer
		},

		async paymentMethod(): Promise<MockPaymentMethod> {
			const paymentMethod = <MockPaymentMethod>{
				id: generateId().toString(),
				card: {
					brand: "FAKEVISA",
					country: "US",
					exp_year: 2020,
					exp_month: 10,
					last4: rando.randomSequence(4, [..."0123456789"]),
					description: "description",
					funding: "credit",
					checks: null,
					wallet: null,
					networks: null,
					three_d_secure_usage: null,
				},
			}
			await procedures.insertPaymentMethod(paymentMethod)
			return paymentMethod
		},

		async setupIntent({customer, subscription, paymentMethod}: {
				customer: MockCustomer
				subscription: MockSubscription
				paymentMethod: MockPaymentMethod
			}): Promise<MockSetupIntent> {
			const setupIntent = <MockSetupIntent>{
				id: generateId().toString(),
				customer: customer.id,
				payment_method: paymentMethod.id,
				metadata: {
					subscription_id: subscription.id
				},
			}
			await procedures.insertSetupIntent(setupIntent)
			return setupIntent
		},

		async subscription({planId, customer, paymentMethod}: {
				planId: string
				customer: MockCustomer
				paymentMethod: MockPaymentMethod
			}): Promise<MockSubscription> {
			const subscription = <MockSubscription>{
				id: generateId().toString(),
				status: "active",
				// plan: {id: planId},
				customer: customer.id,
				cancel_at_period_end: false,
				current_period_end: Date.now() + (30 * day),
				default_payment_method: paymentMethod.id,
			}
			await procedures.insertSubscription(subscription)
			return subscription
		},
	}

	return {procedures, initializers}
}
