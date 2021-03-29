
import {Stripe} from "stripe"
import {StripeComplex} from "./types/stripe-complex.js"
import {Logger} from "../../../toolbox/logger/interfaces.js"
import {StoreTables} from "../api/tables/types/store-tables.js"
import {AuthTables} from "../../auth/tables/types/auth-tables.js"

export function stripeWebhooks({logger, stripeComplex, tables}: {
		logger: Logger
		stripeComplex: StripeComplex
		tables: StoreTables & AuthTables
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
