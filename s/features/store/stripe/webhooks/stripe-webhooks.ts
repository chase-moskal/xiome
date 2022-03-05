
import {Stripe} from "stripe"
import * as dbmage from "dbmage"

import {dedupe} from "../../../../toolbox/dedupe.js"
import {makeStripeLiaison} from "../liaison/stripe-liaison.js"
import {Logger} from "../../../../toolbox/logger/interfaces.js"
import {getStripeId} from "../liaison/helpers/get-stripe-id.js"
import {DatabaseRaw} from "../../../../assembly/backend/types/database.js"
import {getCheckoutDetails, getFundamentalsAboutStripeCustomer, getTiersAndPlansForStripePrices, grantUserRoles, webhookHelpers} from "./helpers/webhook-helpers.js"

export function stripeWebhooks({
		logger, stripeLiaison, databaseRaw,
	}: {
		logger: Logger
		databaseRaw: DatabaseRaw
		stripeLiaison: ReturnType<typeof makeStripeLiaison>
	}) {

	return {
		async "checkout.session.completed"(event: Stripe.Event) {

			logger.info("stripe-webhook checkout.session.completed:", event.data.object)

			const {
				userId,
				session,
				helpers,
				database,
				stripeCustomerId,
				stripeLiaisonAccount,
			} = getCheckoutDetails({event, databaseRaw, stripeLiaison})

			// user is updating their payment method
			if (session.mode === "setup") {

				// get payment method id
				const setupIntent = await helpers.getStripeSetupIntent(session.setup_intent)
				const stripePaymentMethodId = getStripeId(setupIntent.payment_method)

				// update the customer's default payment method
				await stripeLiaisonAccount.customers.update(stripeCustomerId, {
					invoice_settings: {
						default_payment_method: stripePaymentMethodId,
					},
				})

				// detach all other payment methods (enforcing one-at-a-time)
				const paymentMethods = await stripeLiaisonAccount
					.customers.listPaymentMethods(stripeCustomerId, {type: "card"})
				for (const paymentMethod of paymentMethods.data) {
					if (paymentMethod.id !== stripePaymentMethodId)
						await stripeLiaisonAccount.paymentMethods.detach(paymentMethod.id)
				}

				// update all subscriptions to use this payment method
				const subscriptions = await stripeLiaisonAccount
					.subscriptions.list({customer: stripeCustomerId})
				for (const subscription of subscriptions.data) {
					if (subscription.status !== "canceled") {
						await stripeLiaisonAccount.subscriptions.update(subscription.id, {
							default_payment_method: stripePaymentMethodId,
						})
					}
				}
			}

			// user is checking out a subscription, while updating their payment method
			else if (session.mode === "subscription") {

				// fulfill roles related to the subscription
				const {
					current_period_start, current_period_end, items,
				} = await helpers.getStripeSubscription(session.subscription)
				const priceIds = items.data.map(item => getStripeId(item.price))
				const {tierRows, planRows} = await getTiersAndPlansForStripePrices({
					priceIds,
					database,
				})
				await grantUserRoles({
					timeframeEnd: current_period_end,
					timeframeStart: current_period_start,
					tierRows,
					planRows,
					userId,
					database,
				})
			}

		},
		async "invoice.paid"(event: Stripe.Event) {

			logger.info("stripe-webhook invoice.paid:", event.data.object)

			const invoice = <Stripe.Invoice>event.data.object
			const customerId = getStripeId(invoice.customer)
			const stripeLiaisonAccount = stripeLiaison.account(event.account)
			const helpers = webhookHelpers(stripeLiaisonAccount)

			// fulfill roles for subscription
			if (invoice.subscription) {
				const {database, userId} = await getFundamentalsAboutStripeCustomer(databaseRaw, customerId)
				const subscription = await helpers.getStripeSubscription(invoice.subscription)
				const recurringItems = invoice.lines.data
					.filter(line => line.price.type === "recurring")

				const setOfPriceIds = new Set<string>()
				for (const {price} of recurringItems) {
					setOfPriceIds.add(price.id)
				}
				const priceIds = [...setOfPriceIds]
				const tierRows = priceIds.length > 0
					? await database.tables.store.subscriptions.tiers.read(
						dbmage.findAll(priceIds, stripePriceId => ({stripePriceId}))
					)
					: []
				const planIds = dedupe(tierRows.map(row => row.planId.string))
					.map(id => dbmage.Id.fromString(id))
				const planRows = planIds.length > 0
					? await database.tables.store.subscriptions.plans.read(
						dbmage.findAll(planIds, planId => ({planId}))
					)
					: []
				await grantUserRoles({
					userId,
					database,
					planRows,
					tierRows,
					timeframeEnd: subscription.current_period_end,
					timeframeStart: subscription.current_period_start,
				})
			}
		},
		async "invoice.payment_failed"(event: Stripe.Event) {

			logger.info("stripe-webhook invoice.payment_failed:", event.data.object)

			// do nothing, because roles related to subscriptions will
			// eventually expire automatically

		},
		async "customer.subscription.created"(event: Stripe.Event) {
			logger.info("stripe-webhook customer.subscription.created:", event.data.object)
			debugger
		},
		async "customer.subscription.updated"(event: Stripe.Event) {
			logger.info("stripe-webhook customer.subscription.updated:", event.data.object)
			debugger
		},
	}
}
