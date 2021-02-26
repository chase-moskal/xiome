
import {Stripe} from "stripe"
import {payDatalayer} from "./parts/pay-datalayer.js"
import {PayTables} from "../api/types/tables/pay-tables.js"
import {stripeWebhooks} from "./parts/webhooks/stripe-webhooks.js"
import {stripeAccounts} from "./parts/accounts/stripe-accounts.js"
import {stripeSubscriptions} from "./parts/subscriptions/stripe-subscriptions.js"

export async function stripeLiaison({stripe, payTables}: {
		stripe: Stripe
		payTables: PayTables
	}) {

	const accounts = stripeAccounts({
		stripe,
		reauthLink: "fake-reauth-link-lol",
		returnLink: "fake-return-link-lol",
	})

	const subscriptions = stripeSubscriptions({
		stripe,
	})

	const webhooks = stripeWebhooks({
		logger: console,
		subscriptions,
		payDatalayer: payDatalayer({payTables}),
	})

	return {accounts, subscriptions, webhooks}
}
