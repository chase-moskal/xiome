
import {Stripe} from "stripe"
import {payDatalayer} from "./parts/pay-datalayer.js"
import {StoreTables} from "../api/tables/types/store-tables.js"
import {AuthTables} from "../../auth/tables/types/auth-tables.js"
import {stripeWebhooks} from "./parts/webhooks/stripe-webhooks.js"
import {stripeSubscriptions} from "./parts/subscriptions/stripe-subscriptions.js"

export async function stripeLiaison({stripe, tables}: {
			stripe: Stripe
			tables: StoreTables & AuthTables
		}) {

	const subscriptions = stripeSubscriptions({
		stripe,
	})

	const webhooks = stripeWebhooks({
		logger: console,
		subscriptions,
		payDatalayer: payDatalayer({tables}),
	})

	return {subscriptions, webhooks}
}
