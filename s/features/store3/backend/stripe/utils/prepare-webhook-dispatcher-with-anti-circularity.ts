
import Stripe from "stripe"
import {DispatchWebhook, StripeWebhooks} from "../types.js"

export function prepareWebhookDispatcherWithAntiCircularity(pointer: {
		webhooks: StripeWebhooks | undefined
	}) {

	let webhookCircularity: undefined | string

	return <DispatchWebhook>(async function dispatchWebhook(
			type,
			stripeAccountId,
			object,
		) {

		if (webhookCircularity)
			throw new Error(`webhook circularity error "${webhookCircularity}" -> "${type}"`)

		webhookCircularity = type

		const result = await pointer.webhooks[type](<Stripe.Event>{
			type,
			account: stripeAccountId,
			data: <Stripe.Event.Data>{object},
		})

		webhookCircularity = undefined

		return result
	})
}
