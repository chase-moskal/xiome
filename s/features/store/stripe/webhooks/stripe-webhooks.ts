
import {Stripe} from "stripe"
import * as dbmage from "dbmage"

import {getCheckoutDetails, getTiersAndPlansForStripePrices, grantUserRoles, webhookHelpers} from "./helpers/webhook-helpers.js"
import {makeStripeLiaison} from "../liaison/stripe-liaison.js"
import {Logger} from "../../../../toolbox/logger/interfaces.js"
import {DatabaseRaw, DatabaseSchema} from "../../../../assembly/backend/types/database.js"
import {UnconstrainedTable} from "../../../../framework/api/unconstrained-table.js"
import {stripeClientReferenceId} from "../../api/utils/stripe-client-reference-id.js"
import {dedupe} from "../../../../toolbox/dedupe.js"

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
			} = getCheckoutDetails({event, databaseRaw, stripeLiaison})

			if (session.mode === "setup") {
				const setupIntent = await helpers.getStripeSetupIntent(session.setup_intent)
				const stripePaymentMethodId = typeof setupIntent.payment_method === "string"
					? setupIntent.payment_method
					: setupIntent.payment_method.id
				await database.tables.store.billing.paymentMethods.update({
					...dbmage.find({userId}),
					upsert: {
						userId,
						stripePaymentMethodId,
					}
				})
			}
			else if (session.mode === "subscription") {
				const {
					current_period_start, current_period_end, items,
				} = await helpers.getStripeSubscription(session.subscription)
				const priceIds = items.data.map(item => item.price.id)
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
		},
		async "invoice.payment_failed"(event: Stripe.Event) {
			logger.info("stripe-webhook invoice.payment_failed:", event.data.object)
		},
		// async "customer.subscription.updated"(event: Stripe.Event) {
		// 	logger.info("stripe-webhook customer.subscription.updated:", event.data.object)
		// },
	}
}
