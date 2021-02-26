
import {Rando} from "../../../../toolbox/get-rando.js"
import {StripeLiaison} from "../types/stripe-liaison.js"
import {concurrent} from "../../../../toolbox/concurrent.js"
import {pubsub, pubsubs} from "../../../../toolbox/pubsub.js"
import {dbbyMemory} from "../../../../toolbox/dbby/dbby-memory.js"
import {stripeWebhooks} from "../parts/webhooks/stripe-webhooks.js"
import {StripeWebhooks} from "../parts/webhooks/types/stripe-webhooks.js"
import {mockStripeAccounts} from "../parts/accounts/mocks/mock-stripe-accounts.js"
import {mockStripeSubscriptions} from "../parts/subscriptions/mocks/mock-stripe-subscriptions.js"
import {PayTables} from "../../api/types/tables/pay-tables.js"
import {payDatalayer} from "../parts/pay-datalayer.js"

export async function mockStripeLiaison({rando, payTables}: {
		rando: Rando
		payTables: PayTables
	}): Promise<StripeLiaison> {

	// create pubsub contexts for each webhook
	const {
		publishers: webhookPublishers,
		subscribers: webhookSubscribers,
	} = pubsubs<StripeWebhooks>({
		["checkout.session.completed"]: pubsub(),
		["customer.subscription.updated"]: pubsub(),
	})

	const accounts = mockStripeAccounts({
		rando,
		mockStripeAccountLink: "https://example.xiome.io/stripe",
	})

	// give webhook publishes to the mocks
	const subscriptions = mockStripeSubscriptions({
		rando,
		tables: await concurrent({
			customers: dbbyMemory<any>(),
			setupIntents: dbbyMemory<any>(),
			subscriptions: dbbyMemory<any>(),
			paymentMethods: dbbyMemory<any>(),
		}),
		webhooks: webhookPublishers,
	})

	// create genuine webhook instance, which uses mocks
	const webhooks = stripeWebhooks({
		logger: console,
		payDatalayer: payDatalayer({payTables}),
		subscriptions,
	})

	// finally register each genuine webhook as a subscriber to the pubsub
	for (const [key, subscribe] of Object.entries(webhookSubscribers)) {
		subscribe(webhooks[key].bind(webhooks))
	}

	return {accounts, subscriptions, webhooks}
}
