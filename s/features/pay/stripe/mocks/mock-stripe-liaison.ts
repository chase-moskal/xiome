
import {Rando} from "../../../../toolbox/get-rando.js"
import {payDatalayer} from "../parts/pay-datalayer.js"
import {StripeLiaison} from "../types/stripe-liaison.js"
import {pubsub, pubsubs} from "../../../../toolbox/pubsub.js"
import {PayTables} from "../../api/tables/types/pay-tables.js"
import {mockStripeTables} from "./tables/mock-stripe-tables.js"
import {stripeWebhooks} from "../parts/webhooks/stripe-webhooks.js"
import {AuthTables} from "../../../auth/tables/types/auth-tables.js"
import {StripeWebhooks} from "../parts/webhooks/types/stripe-webhooks.js"
import {mockStripeAccounts} from "../parts/accounts/mocks/mock-stripe-accounts.js"
import {mockStripeSubscriptions} from "../parts/subscriptions/mocks/mock-stripe-subscriptions.js"
import {FlexStorage} from "../../../../toolbox/flex-storage/types/flex-storage.js"

export async function mockStripeLiaison({rando, tableStorage, tables}: {
			rando: Rando
			tableStorage: FlexStorage
			tables: AuthTables & PayTables
		}): Promise<StripeLiaison> {

	// create pubsub contexts for each webhook
	const {
		publishers: webhookPublishers,
		subscribers: webhookSubscribers,
	} = pubsubs<StripeWebhooks>({
		["checkout.session.completed"]: pubsub(),
		["customer.subscription.updated"]: pubsub(),
	})

	const stripeTables = await mockStripeTables(tableStorage)

	const accounts = mockStripeAccounts({
		rando,
		mockStripeTables: stripeTables,
		mockStripeAccountLink: "https://example.xiome.io/stripe",
	})

	// give webhook publishes to the mocks
	const subscriptions = mockStripeSubscriptions({
		rando,
		tables: stripeTables,
		webhooks: webhookPublishers,
	})

	// create genuine webhook instance, which uses mocks
	const webhooks = stripeWebhooks({
		subscriptions,
		logger: console,
		payDatalayer: payDatalayer({tables}),
	})

	// finally register each genuine webhook as a subscriber to the pubsub
	for (const [key, subscribe] of Object.entries(webhookSubscribers)) {
		subscribe(webhooks[key].bind(webhooks))
	}

	return {accounts, subscriptions, webhooks}
}
