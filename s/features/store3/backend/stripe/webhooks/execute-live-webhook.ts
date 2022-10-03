
import {Stripe} from "stripe"
import {StripeWebhooks} from "../types.js"

export async function executeLiveWebhook({
		stripe, payload, signature, endpointSecret, webhooks,
	}: {
		stripe: Stripe
		payload: any
		signature: string
		endpointSecret: string
		webhooks: StripeWebhooks
	}) {

	const event = await stripe.webhooks.constructEventAsync(
		payload,
		signature,
		endpointSecret,
	)

	const webhook = webhooks[event.type]

	if (webhook)
		await webhook(event)
}
