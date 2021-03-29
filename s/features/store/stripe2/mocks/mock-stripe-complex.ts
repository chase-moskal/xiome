
import {Stripe} from "stripe"
import {Rando} from "../../../../toolbox/get-rando.js"
import {StripeComplex} from "../types/stripe-complex.js"
import {StripeWebhooks} from "../types/stripe-webhooks.js"
import {find} from "../../../../toolbox/dbby/dbby-helpers.js"
import {getStripeId} from "../liaison/helpers/get-stripe-id.js"
import {StripeLiaisonForApp} from "../types/stripe-liaison-app.js"
import {MockStripeTables} from "./tables/types/mock-stripe-tables.js"
import {StripeLiaisonForPlatform} from "../types/stripe-liaison-for-platform.js"
import {prepareConstrainTables} from "../../../../toolbox/dbby/dbby-constrain.js"

export function mockStripeComplex({rando, tables, webhooks}: {
		rando: Rando
		tables: MockStripeTables
		webhooks: StripeWebhooks
	}): StripeComplex {

	const generateId = () => rando.randomId()
	function respond<xResource>(resource: xResource): Stripe.Response<xResource> {
		return {
			headers: {},
			lastResponse: undefined,
			...resource,
		}
	}

	const stripeLiaisonForPlatform: StripeLiaisonForPlatform = {
		accounts: {
			async create(params) {
				const account: Partial<Stripe.Account> = {
					id: generateId(),
					type: params.type,
					email: params.email,
				}
				return respond(<Stripe.Account>account)
			},
			async retrieve(id) {
				const account = await tables.accounts.one(find({id}))
				return respond(<Stripe.Account>account)
			},
		},
		accountLinks: {
			async create(params) {
				const accountLink: Partial<Stripe.AccountLink> = {
					url: `https://fake.xiome.io/stripe-account-setup`,
				}
				return respond(<Stripe.AccountLink>accountLink)
			},
		},
	}

	async function webhookEvent<xObject extends {}>(
			type: keyof StripeWebhooks,
			object: xObject,
		) {
		return webhooks[type](<Stripe.Event>{
			type,
			data: <Stripe.Event.Data>{object},
		})
	}

	const rawTables = tables
	function connectStripeLiaisonForApp(stripeConnectAccountId: string): StripeLiaisonForApp {
		const tables = prepareConstrainTables(rawTables)({
			"_connectedAccount": stripeConnectAccountId,
		})
		return {
			customers: {
				async create(params) {
					const customer: Partial<Stripe.Customer> = {
						id: generateId(),
						email: params.email,
						invoice_settings: <any>{default_payment_method: undefined},
					}
					await tables.customers.create(customer)
					return respond(<Stripe.Customer>customer)
				},
				async retrieve(id) {
					const customer = await tables.customers.one(find({id}))
					return respond(<Stripe.Customer>customer)
				},
				async update(id, params) {
					await tables.customers.update({
						...find({id}),
						write: {
							email: params.email,
							invoice_settings: <any>params.invoice_settings,
						},
					})
					const customer = await tables.customers.one(find({id}))
					return respond(<Stripe.Customer>customer)
				},
			},

			checkout: undefined,
			paymentMethods: undefined,
			prices: undefined,
			products: undefined,
			setupIntents: undefined,
			subscriptions: undefined,

			// customers: {
			// 	async createCustomer() {
			// 		const customer: Partial<Stripe.Customer> = {
			// 			id: generateId(),
			// 			invoice_settings: <any>{
			// 				default_payment_method: undefined,
			// 			},
			// 		}
			// 		await tables.customers.create(customer)
			// 		return <Stripe.Customer>customer
			// 	},
			// 	async updateDefaultPaymentMethod({customer, paymentMethod}) {
			// 		await tables.customers.update({
			// 			...find({id: customer}),
			// 			write: {
			// 				invoice_settings: <any>{
			// 					default_payment_method: undefined,
			// 				},
			// 			},
			// 		})
			// 	},
			// 	async fetchPaymentMethod(paymentMethod) {
			// 		return <Stripe.PaymentMethod>await tables
			// 			.paymentMethods.one(find({id: paymentMethod}))
			// 	},
			// 	async fetchPaymentDetailsByIntentId(intentId) {
			// 		const intent = await tables.setupIntents.one(find({id: intentId}))
			// 		const paymentMethodId = getStripeId(intent.payment_method)
			// 		return <Stripe.PaymentMethod>await tables
			// 			.paymentMethods.one(find({id: paymentMethodId}))
			// 	},
			// 	async fetchPaymentDetailsBySubscriptionId(subscriptionId) {
			// 		const subscription = await tables
			// 			.subscriptions.one(find({id: subscriptionId}))
			// 		const paymentMethodId = getStripeId(subscription.default_payment_method)
			// 		return <Stripe.PaymentMethod>await tables
			// 			.paymentMethods.one(find({id: paymentMethodId}))
			// 	},
			// },
			// checkouts: {
			// 	async purchaseSubscriptions({userId, prices, customer}) {
			// 		const session = <Stripe.Checkout.Session>{
			// 			id: generateId(),
			// 			mode: "subscription",
			// 			payment_status: "paid",
			// 			line_items: {
			// 				data: prices.map(id => ({price: {id}})),
			// 			},
			// 		}
			// 		await webhookEvent("checkout.session.completed", session)
			// 		return <Stripe.Checkout.Session>session
			// 	},
			// 	async setupSubscription({userId, customer, subscription}) {
			// 		const session = <Stripe.Checkout.Session>{
			// 			id: generateId(),
			// 			mode: "setup",
			// 			subscription,
			// 		}
			// 		await webhookEvent("checkout.session.completed", session)
			// 		return <Stripe.Checkout.Session>session
			// 	},
			// },
			// products: {},
			// subscriptions: {
			// 	async fetchSubscription(id) {
			// 		return <Stripe.Subscription>await tables
			// 			.subscriptions.one(find({id}))
			// 	},
			// 	async updatePaymentMethodForSubscription({
			// 			subscription,
			// 			paymentMethod,
			// 		}) {
			// 		await tables.subscriptions.update({
			// 			...find({id: subscription}),
			// 			write: {default_payment_method: paymentMethod},
			// 		})
			// 	},
			// 	async scheduleSubscriptionCancellation(subscription) {
			// 		await tables.subscriptions.update({
			// 			...find({id: subscription}),
			// 			write: {cancel_at_period_end: true},
			// 		})
			// 	},
			// },
		}
	}

	return {stripeLiaisonForPlatform, connectStripeLiaisonForApp}
}
