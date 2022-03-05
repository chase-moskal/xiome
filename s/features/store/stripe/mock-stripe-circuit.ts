
import {find} from "dbmage"
import {Rando} from "dbmage"
import {Stripe} from "stripe"
import {FlexStorage} from "dbmage"

import {StripeWebhooks} from "./types/stripe-webhooks.js"
import {Logger} from "../../../toolbox/logger/interfaces.js"
import {stripeWebhooks} from "./webhooks/stripe-webhooks.js"
import {getStripeId} from "./liaison/helpers/get-stripe-id.js"
import {StripeLiaisonAccount} from "../types/store-concepts.js"
import {mockStripeLiaison} from "./mocks/mock-stripe-liaison.js"
import {mockStripeTables} from "./mocks/tables/mock-stripe-tables.js"
import {DatabaseRaw} from "../../../assembly/backend/types/database.js"
import {MockStripeRecentDetails} from "./types/mock-stripe-listeners.js"

export async function mockStripeCircuit({
		rando, logger, tableStorage, databaseRaw,
	}: {
		rando: Rando
		logger: Logger
		databaseRaw: DatabaseRaw
		tableStorage: FlexStorage
	}) {

	const stripeTables = await mockStripeTables({tableStorage})

	let webhookCircularity: undefined | string

	async function webhookEvent<xObject extends {}>(
			type: keyof StripeWebhooks,
			stripeAccountId: string,
			object: xObject,
		) {
		if (webhookCircularity)
			throw new Error(`webhook circularity error "${webhookCircularity}" -> "${type}"`)
		webhookCircularity = type
		const result = await webhooks[type](<Stripe.Event>{
			type,
			account: stripeAccountId,
			data: <Stripe.Event.Data>{object},
		})
		webhookCircularity = undefined
		return result
	}

	const recentDetails = <MockStripeRecentDetails>{}

	const stripeLiaison = mockStripeLiaison({
		rando,
		recentDetails,
		tables: stripeTables,
		webhookEvent,
	})

	const webhooks = stripeWebhooks({
		logger,
		databaseRaw,
		stripeLiaison,
	})

	const mockHelpers = {

		async setPaymentMethod({customer, stripeLiaisonAccount}: {
				customer: string
				stripeLiaisonAccount: StripeLiaisonAccount
			}) {
			await stripeTables.paymentMethods.delete(find({customer}))
			const paymentMethod = await stripeLiaisonAccount.paymentMethods.create({
				customer,
				type: "card",
				card: <any>{
					brand: "fakevisa",
					country: "canada",
					exp_month: 1,
					exp_year: 2032,
					last4: rando.randomSequence(4, [..."0123456789"]),
				},
			})
			return paymentMethod
		},

		async createSetupIntent({customer, paymentMethod, stripeLiaisonAccount}: {
				customer: string
				paymentMethod: Stripe.PaymentMethod
				stripeLiaisonAccount: StripeLiaisonAccount
			}) {
			const setupIntent = await stripeLiaisonAccount.setupIntents.create({
				customer,
				payment_method: paymentMethod.id,
			})
			return setupIntent
		},

		async createPaymentIntent({
				amount, customer, paymentMethod, stripeLiaisonAccount,
			}: {
				amount: number
				customer: string
				paymentMethod: Stripe.PaymentMethod
				stripeLiaisonAccount: StripeLiaisonAccount
			}) {
			const paymentIntent = await stripeLiaisonAccount.paymentIntents.create({
				amount,
				customer,
				currency: "usd",
				payment_method: paymentMethod.id,
			})
			return paymentIntent
		},

		async createSubscription({
				customer, paymentMethod, stripeLiaisonAccount, items,
			}: {
				customer: string
				paymentMethod: Stripe.PaymentMethod
				stripeLiaisonAccount: StripeLiaisonAccount
				items: Stripe.SubscriptionCreateParams["items"]
			}) {
			const subscription = await stripeLiaisonAccount.subscriptions.create({
				customer,
				default_payment_method: paymentMethod.id,
				items,
			})
			return subscription
		}
	}

	return {
		stripeLiaison,
		mockStripeOperations: {
			async linkStripeAccount(stripeAccountId: string) {
				await stripeTables.accounts.update({
					...find({id: stripeAccountId}),
					write: {
						email: "fake-stripe-account-email@xiome.io",
						charges_enabled: true,
						payouts_enabled: true,
						details_submitted: true,
					},
				})
			},
			async linkStripeAccountThatIsIncomplete(stripeAccountId: string) {
				await stripeTables.accounts.update({
					...find({id: stripeAccountId}),
					write: {
						charges_enabled: false,
						payouts_enabled: false,
						details_submitted: false,
					},
				})
			},
			async configureStripeAccount(stripeAccountId: string, completed: boolean) {
				await stripeTables.accounts.update({
					...find({id: stripeAccountId}),
					write: completed
						? {
							charges_enabled: true,
							payouts_enabled: true,
							details_submitted: true,
						}
						: {
							charges_enabled: false,
							payouts_enabled: false,
							details_submitted: false,
						},
				})
			},
			async updatePaymentMethod(stripeAccountId: string, stripeSessionId: string) {
				const stripeLiaisonAccount = stripeLiaison.account(stripeAccountId)
				const session = await stripeTables
					.checkoutSessions.readOne(find({id: stripeSessionId}))
				const customer = <string>session.customer
				const paymentMethod = await mockHelpers.setPaymentMethod({
					customer,
					stripeLiaisonAccount,
				})
				const setupIntent = await mockHelpers.createSetupIntent({
					customer,
					paymentMethod,
					stripeLiaisonAccount,
				})
				await webhookEvent("checkout.session.completed", stripeAccountId, {
					customer,
					mode: "setup",
					setup_intent: setupIntent.id,
					client_reference_id: session.client_reference_id,
				})
			},
			async checkoutSubscriptionTier(stripeAccountId: string, stripeSessionId: string) {
				const session = await stripeTables
					.checkoutSessions.readOne(find({id: stripeSessionId}))
				const stripeLiaisonAccount = stripeLiaison.account(stripeAccountId)
				const customer = <string>session.customer
				const paymentMethod = await mockHelpers.setPaymentMethod({
					customer,
					stripeLiaisonAccount,
				})
				const subscription = await mockHelpers.createSubscription({
					customer,
					paymentMethod,
					stripeLiaisonAccount,
					items: session.line_items.data.map(item => ({
						price: getStripeId(item.price),
						quantity: item.quantity,
					})),
				})
				session.subscription = subscription.id
				await stripeTables.checkoutSessions.update({
					...find({id: stripeSessionId}),
					write: {subscription: subscription.id},
				})
				await webhookEvent("checkout.session.completed", stripeAccountId, {
					customer,
					mode: "subscription",
					subscription,
					client_reference_id: session.client_reference_id,
					payment_intent: recentDetails.subscriptionCreation.paymentIntent,
				})
			},
		},
	}
}
