
import {Stripe} from "stripe"
import {Rando} from "../../../../../toolbox/get-rando.js"
import {day} from "../../../../../toolbox/goodtimes/times.js"
import {and} from "../../../../../toolbox/dbby/dbby-helpers.js"
import {MockCustomer} from "../tables/types/rows/mock-customer.js"
import {MockStripeTables} from "../tables/types/mock-stripe-tables.js"
import {MockSetupIntent} from "../tables/types/rows/mock-setup-intent.js"
import {MockSubscription} from "../tables/types/rows/mock-subscription.js"
import {MockPaymentMethod} from "../tables/types/rows/mock-payment-method.js"

export function mockLiaisonUtils({rando, tables}: {
		rando: Rando
		tables: MockStripeTables
	}) {

	const generateId = () => rando.randomId()

	const procedures = {
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
		async fetchCustomer(id: string) {
			return tables.customers.one({conditions: and({equal: {id}})})
		},
		async fetchSubscription(id: string) {
			return tables.subscriptions.one({conditions: and({equal: {id}})})
		},
		async fetchPaymentMethod(id: string) {
			return tables.paymentMethods.one({conditions: and({equal: {id}})})
		},
		async fetchSetupIntent(id: string) {
			return tables.setupIntents.one({conditions: and({equal: {id}})})
		},
	}

	const initializers = {
		mockSessionForSubscriptionPurchase({
				userId,
				customer,
				subscription,
			}: {
				userId: string
				customer: MockCustomer
				subscription: MockSubscription
			}): Partial<Stripe.Checkout.Session> {
			return {
				id: generateId(),
				mode: "subscription",
				customer: customer.id,
				client_reference_id: userId,
				subscription: subscription.id,
			}
		},
		mockSessionForSubscriptionUpdate({
				flow,
				userId,
				customer,
				setupIntent,
			}: {
				userId: string
				flow: UpdateFlow
				customer: MockCustomer
				setupIntent: MockSetupIntent
			}): Partial<Stripe.Checkout.Session> {
			return {
				id: generateId(),
				mode: "setup",
				metadata: {flow},
				customer: customer.id,
				client_reference_id: userId,
				setup_intent: setupIntent.id,
			}
		},
		async mockCustomer(): Promise<MockCustomer> {
			const customer = {
				id: generateId()
			}
			await procedures.insertCustomer(customer)
			return customer
		},
		async mockPaymentMethod(): Promise<MockPaymentMethod> {
			const paymentMethod = <MockPaymentMethod>{
				id: generateId(),
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
		async mockSetupIntent({customer, subscription, paymentMethod}: {
				customer: MockCustomer
				subscription: MockSubscription
				paymentMethod: MockPaymentMethod
			}): Promise<MockSetupIntent> {
			const setupIntent = <MockSetupIntent>{
				id: generateId(),
				customer: customer.id,
				payment_method: paymentMethod.id,
				metadata: {
					subscription_id: subscription.id
				},
			}
			await procedures.insertSetupIntent(setupIntent)
			return setupIntent
		},
		async mockSubscription({planId, customer, paymentMethod}: {
				planId: string
				customer: MockCustomer
				paymentMethod: MockPaymentMethod
			}): Promise<MockSubscription> {
			const subscription = <MockSubscription>{
				id: generateId(),
				status: "active",
				plan: {id: planId},
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
