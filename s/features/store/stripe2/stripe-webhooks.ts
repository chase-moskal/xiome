
import {Stripe} from "stripe"
import {StripeComplex} from "./types/stripe-complex.js"
import {AuthTables} from "../../auth/types/auth-tables.js"
import {Logger} from "../../../toolbox/logger/interfaces.js"
import {StoreTables} from "../api/tables/types/store-tables.js"
import {UnconstrainedTables} from "../../../framework/api/types/table-namespacing-for-apps.js"

export function stripeWebhooks({logger}: {
		logger: Logger
		stripeComplex: StripeComplex
		authTables: UnconstrainedTables<AuthTables>
		storeTables: UnconstrainedTables<StoreTables>
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
