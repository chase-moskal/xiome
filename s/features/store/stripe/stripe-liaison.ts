
import {Stripe} from "stripe"
import {payDatalayer} from "./parts/pay-datalayer.js"
import {PayTables} from "../api/tables/types/store-tables.js"
import {AuthTables} from "../../auth/tables/types/auth-tables.js"
import {stripeWebhooks} from "./parts/webhooks/stripe-webhooks.js"
import {stripeAccounts} from "./parts/accounts/stripe-accounts.js"
import {stripeSubscriptions} from "./parts/subscriptions/stripe-subscriptions.js"

export async function stripeLiaison({stripe, bankPopupLink, tables}: {
		stripe: Stripe
		bankPopupLink: string
		tables: PayTables & AuthTables
		stripeConnectAccountId: string
	}) {

	const accounts = stripeAccounts({
		stripe,
		returnLink: `${bankPopupLink}#stripe-return`,
		refreshLink: `${bankPopupLink}#stripe-refresh`,
	})

	const subscriptions = stripeSubscriptions({
		stripe,
	})

	const webhooks = stripeWebhooks({
		logger: console,
		subscriptions,
		payDatalayer: payDatalayer({tables}),
	})

	return {accounts, subscriptions, webhooks}
}
