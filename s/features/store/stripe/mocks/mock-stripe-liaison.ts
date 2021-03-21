
import {Rando} from "../../../../toolbox/get-rando.js"
import {payDatalayer} from "../parts/pay-datalayer.js"
import {StripeLiaison} from "../types/stripe-liaison.js"
import {pubsub, pubsubs} from "../../../../toolbox/pubsub.js"
import {StoreTables} from "../../api/tables/types/store-tables.js"
import {ConnectedTables} from "./tables/types/connected-tables.js"
import {stripeWebhooks} from "../parts/webhooks/stripe-webhooks2.js"
import {AuthTables} from "../../../auth/tables/types/auth-tables.js"
import {StripeWebhooks} from "../parts/webhooks/types/stripe-webhooks.js"
import {mockStripeSubscriptions} from "../parts/subscriptions/mocks/mock-stripe-subscriptions.js"

export function mockStripeLiaison({
			rando,
			tables,
			connectedTables,
		}: {
			rando: Rando
			tables: StoreTables & AuthTables
			connectedTables: ConnectedTables
		}): StripeLiaison {

	// create pubsub contexts for each webhook
	const {
		publishers: webhookPublishers,
		subscribers: webhookSubscribers,
	} = pubsubs<StripeWebhooks>({
		["checkout.session.completed"]: pubsub(),
		["customer.subscription.updated"]: pubsub(),
	})

	// give webhook publishes to the mocks
	const subscriptions = mockStripeSubscriptions({
		rando,
		connectedTables,
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

	return {subscriptions, webhooks}
}
