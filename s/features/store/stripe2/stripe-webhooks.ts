
import {Stripe} from "stripe"

import {StoreTables} from "../types/store-tables.js"
import {AuthTables} from "../../auth/types/auth-tables.js"
import {Logger} from "../../../toolbox/logger/interfaces.js"
import {makeStripeLiaison} from "./liaison/stripe-liaison.js"
import {UnconstrainedTables} from "../../../framework/api/types/table-namespacing-for-apps.js"

export function stripeWebhooks({logger}: {
		logger: Logger
		authTables: UnconstrainedTables<AuthTables>
		storeTables: UnconstrainedTables<StoreTables>
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
