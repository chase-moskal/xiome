
import {Stripe} from "stripe"
import {Rando} from "../../../../toolbox/get-rando.js"
import {StripeLiaison} from "../types/stripe-liaison.js"
import {StripeWebhooks} from "../types/stripe-webhooks.js"
import {find} from "../../../../toolbox/dbby/dbby-helpers.js"
import {getStripeId} from "../liaison/helpers/get-stripe-id.js"
import {MockStripeTables} from "./tables/types/mock-stripe-tables.js"
import {PlatformStripeLiaison} from "../types/platform-stripe-liaison.js"
import {AppStripeLiaison} from "../types/app-stripe-liaison.js"
import {prepareConstrainTables} from "../../../../toolbox/dbby/dbby-constrain.js"

export function mockStripeLiaison({rando, tables, webhooks}: {
		rando: Rando
		tables: MockStripeTables
		webhooks: StripeWebhooks
	}): StripeLiaison {

	const generateId = () => rando.randomId()

	const platform: PlatformStripeLiaison = {
		accounting: {
			async getStripeAccount(id: string) {
				return <Stripe.Account>await tables.accounts.one(find({id}))
			},
			async createStripeAccount() {
				const account: Partial<Stripe.Account> = {
					id: generateId(),
					email: undefined,
					type: "standard",
					charges_enabled: false,
					details_submitted: false,
					payouts_enabled: false,
				}
				await tables.accounts.create(account)
				return <Stripe.Account>account
			},
			async createAccountSetupLink({account, type}) {
				await tables.accounts.update({
					...find({id: account}),
					write: {
						email: `${(
								rando.randomSequence(8, [..."0123456789abcdef"])
							)}@fake.xiome.io`,
						charges_enabled: true,
						details_submitted: true,
						payouts_enabled: true,
					},
				})
				return <Stripe.AccountLink>{
					url: "https://fake.xiome.io/stripe-account-setup",
				}
			},
		},
	}

	const rawTables = tables

	async function webhookEvent<xObject extends {}>(
			type: keyof StripeWebhooks,
			object: xObject,
		) {
		return webhooks[type](<Stripe.Event>{
			type,
			data: <Stripe.Event.Data>{object},
		})
	}

	function connect(stripeConnectAccountId: string): AppStripeLiaison {
		const tables = prepareConstrainTables(rawTables)({
			"_connectedAccount": stripeConnectAccountId,
		})
		return {
			customers: {
				async createCustomer() {
					const customer: Partial<Stripe.Customer> = {
						id: generateId(),
						invoice_settings: <any>{
							default_payment_method: undefined,
						},
					}
					await tables.customers.create(customer)
					return <Stripe.Customer>customer
				},
				async updateDefaultPaymentMethod({customer, paymentMethod}) {
					await tables.customers.update({
						...find({id: customer}),
						write: {
							invoice_settings: <any>{
								default_payment_method: undefined,
							},
						},
					})
				},
				async fetchPaymentMethod(paymentMethod) {
					return <Stripe.PaymentMethod>await tables
						.paymentMethods.one(find({id: paymentMethod}))
				},
				async fetchPaymentDetailsByIntentId(intentId) {
					const intent = await tables.setupIntents.one(find({id: intentId}))
					const paymentMethodId = getStripeId(intent.payment_method)
					return <Stripe.PaymentMethod>await tables
						.paymentMethods.one(find({id: paymentMethodId}))
				},
				async fetchPaymentDetailsBySubscriptionId(subscriptionId) {
					const subscription = await tables
						.subscriptions.one(find({id: subscriptionId}))
					const paymentMethodId = getStripeId(subscription.default_payment_method)
					return <Stripe.PaymentMethod>await tables
						.paymentMethods.one(find({id: paymentMethodId}))
				},
			},
			checkouts: {
				async purchaseSubscriptions({userId, prices, customer}) {
					const session = <Stripe.Checkout.Session>{
						id: generateId(),
						mode: "subscription",
						payment_status: "paid",
						line_items: {
							data: prices.map(id => ({price: {id}})),
						},
					}
					await webhookEvent("checkout.session.completed", session)
					return <Stripe.Checkout.Session>session
				},
				async setupSubscription({userId, customer, subscription}) {
					const session = <Stripe.Checkout.Session>{
						id: generateId(),
						mode: "setup",
						subscription,
					}
					await webhookEvent("checkout.session.completed", session)
					return <Stripe.Checkout.Session>session
				},
			},
			products: {},
			subscriptions: {
				async fetchSubscription(id) {
					return <Stripe.Subscription>await tables
						.subscriptions.one(find({id}))
				},
				async updatePaymentMethodForSubscription({
						subscription,
						paymentMethod,
					}) {
					await tables.subscriptions.update({
						...find({id: subscription}),
						write: {default_payment_method: paymentMethod},
					})
				},
				async scheduleSubscriptionCancellation(subscription) {
					await tables.subscriptions.update({
						...find({id: subscription}),
						write: {cancel_at_period_end: true},
					})
				},
			}
		}
	}

	return {platform, connect}
}
