
import {pubsub, pubsubs} from "../../../../toolbox/pubsub.js"
import {StripeWebhooks} from "../types/stripe-webhooks.js"

export function mockStripeCircuit() {

	const {
		publishers: webhookPublishers,
		subscribers: webhookSubscribers,
	} = pubsubs<StripeWebhooks>({
		"checkout.session.completed": pubsub(),
		"invoice.paid": pubsub(),
		"invoice.payment_failed": pubsub(),
		"customer.subscription.updated": pubsub(),
	})

	
}
