
import {Stripe} from "stripe"

import {makeStripeLiaison} from "../liaison/stripe-liaison.js"
import {Logger} from "../../../../toolbox/logger/interfaces.js"
import {DatabaseSelect} from "../../../../assembly/backend/types/database.js"

export function stripeWebhooks({logger, stripeLiaison, database}: {
		logger: Logger
		stripeLiaison: ReturnType<typeof makeStripeLiaison>
		database: DatabaseSelect<"auth" | "store">
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
