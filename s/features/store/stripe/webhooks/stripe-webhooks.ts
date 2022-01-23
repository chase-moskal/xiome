
import {Stripe} from "stripe"

import {makeStripeLiaison} from "../liaison/stripe-liaison.js"
import {Logger} from "../../../../toolbox/logger/interfaces.js"
import {DatabaseRaw} from "../../../../assembly/backend/types/database.js"

export function stripeWebhooks({logger, stripeLiaison, databaseRaw}: {
		logger: Logger
		databaseRaw: DatabaseRaw
		stripeLiaison: ReturnType<typeof makeStripeLiaison>
	}) {
	return {
		async "checkout.session.completed"(event: Stripe.Event) {
			logger.info("stripe-webhook checkout.session.completed:", event.data.object)
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
