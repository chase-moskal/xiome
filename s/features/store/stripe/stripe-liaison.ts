
import {Stripe} from "stripe"
import {payDatalayer} from "./parts/pay-datalayer.js"
import {StoreTables} from "../api/tables/types/store-tables.js"
import {AuthTables} from "../../auth/tables/types/auth-tables.js"
import {stripeWebhooks} from "./parts/webhooks/stripe-webhooks.js"
import {stripeAccounting} from "./parts/accounts/stripe-accounting.js"
import {stripeSubscriptions} from "./parts/subscriptions/stripe-subscriptions.js"

export async function stripeLiaison({stripe, tables}: {
		stripe: Stripe
		bankPopupLink: string
		tables: StoreTables & AuthTables
		stripeConnectAccountId: string
	}) {

	// const accounts = stripeAccounts({
	// 	stripe,
	// 	returnLink: `${bankPopupLink}#stripe-return`,
	// 	refreshLink: `${bankPopupLink}#stripe-refresh`,
	// })

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
