
import Stripe from "stripe"
import * as dbmage from "dbmage"

import {getStripeId} from "../liaison/helpers/get-stripe-id.js"
import {DispatchWebhook, MockStripeRecentDetails} from "../types.js"
import {StripeLiaison, StripeLiaisonAccount} from "../liaison/types.js"
import {MetaDataTables, MockStripeTables} from "../liaison/mock/tables/types.js"

export function prepareMockStripeOperations({
		rando, stripeTables, metaDataTables,
		stripeLiaison, recentDetails, dispatchWebhook,
	}: {
		rando: dbmage.Rando
		stripeLiaison: StripeLiaison
		stripeTables: MockStripeTables
		metaDataTables: MetaDataTables
		recentDetails: MockStripeRecentDetails
		dispatchWebhook: DispatchWebhook
	}) {

	const mockHelpers = {

		async setPaymentMethod({customer, stripeLiaisonAccount}: {
				customer: string
				stripeLiaisonAccount: StripeLiaisonAccount
			}) {
			await stripeTables.paymentMethods.delete(dbmage.find({customer}))
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
		},
	}

	return {
		async linkStripeAccount(stripeAccountId: string) {
			await stripeTables.accounts.update({
				...dbmage.find({id: stripeAccountId}),
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
				...dbmage.find({id: stripeAccountId}),
				write: {
					charges_enabled: false,
					payouts_enabled: false,
					details_submitted: false,
				},
			})
		},
		async configureStripeAccount(stripeAccountId: string, completed: boolean) {
			await stripeTables.accounts.update({
				...dbmage.find({id: stripeAccountId}),
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
		async completePaymentMethodCheckout(
				stripeAccountId: string, stripeSessionId: string, isFailing?: boolean
			) {
			const stripeLiaisonAccount = stripeLiaison.account(stripeAccountId)
			const session = await stripeTables
				.checkoutSessions.readOne(dbmage.find({id: stripeSessionId}))
			const customer = <string>session.customer
			const paymentMethod = await mockHelpers.setPaymentMethod({
				customer,
				stripeLiaisonAccount,
			})
			await metaDataTables.paymentMethodMetaData.create({
				id: paymentMethod.id,
				isFailing
			})
			const setupIntent = await mockHelpers.createSetupIntent({
				customer,
				paymentMethod,
				stripeLiaisonAccount,
			})
			await dispatchWebhook("checkout.session.completed", stripeAccountId, {
				customer,
				mode: "setup",
				setup_intent: setupIntent.id,
				client_reference_id: session.client_reference_id,
			})
		},
		async checkoutSubscriptionTier(stripeAccountId: string, stripeSessionId: string) {
			const session = await stripeTables
				.checkoutSessions.readOne(dbmage.find({id: stripeSessionId}))
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
				...dbmage.find({id: stripeSessionId}),
				write: {subscription: subscription.id},
			})
			await dispatchWebhook("checkout.session.completed", stripeAccountId, {
				customer,
				mode: "subscription",
				subscription,
				client_reference_id: session.client_reference_id,
				payment_intent: recentDetails.subscriptionCreation.paymentIntent,
			})
		},
	}
}
