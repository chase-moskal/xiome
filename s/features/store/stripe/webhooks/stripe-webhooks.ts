
import {Stripe} from "stripe"
import * as dbmage from "dbmage"

import {makeStripeLiaison} from "../liaison/stripe-liaison.js"
import {Logger} from "../../../../toolbox/logger/interfaces.js"
import {DatabaseRaw} from "../../../../assembly/backend/types/database.js"
import {stripeClientReferenceId} from "../../api/utils/stripe-client-reference-id.js"

export function stripeWebhooks({logger, stripeLiaison, databaseRaw}: {
		logger: Logger
		databaseRaw: DatabaseRaw
		stripeLiaison: ReturnType<typeof makeStripeLiaison>
	}) {
	return {
		async "checkout.session.completed"(event: Stripe.Event) {
			const session: any = event.data.object
			logger.info("stripe-webhook checkout.session.completed:", session)
			if (session.mode === "setup") {
				const raw = stripeClientReferenceId.parse(session.client_reference_id)
				const appId = dbmage.Id.fromString(raw.appId)
				const userId = dbmage.Id.fromString(raw.userId)
				const stripeAccount = event.account
				const stripeLiaisonAccount = stripeLiaison.account(stripeAccount)
				const setupIntent = await stripeLiaisonAccount.setupIntents
					.retrieve(session.setup_intent)
				const stripePaymentMethodId = typeof setupIntent.payment_method === "string"
					? setupIntent.payment_method
					: setupIntent.payment_method.id
				const paymentMethodsTable = databaseRaw.tables.store.billing.paymentMethods
					.constrainForApp(appId)
				await paymentMethodsTable.update({
					...dbmage.find({userId}),
					upsert: {
						userId,
						stripePaymentMethodId,
					}
				})
			}
		},
		async "invoice.paid"(event: Stripe.Event) {
			logger.info("stripe-webhook invoice.paid:", event.data.object)
		},
		async "invoice.payment_failed"(event: Stripe.Event) {
			logger.info("stripe-webhook invoice.payment_failed:", event.data.object)
		},
		async "customer.subscription.updated"(event: Stripe.Event) {
			logger.info("stripe-webhook customer.subscription.updated:", event.data.object)
		},
	}
}
