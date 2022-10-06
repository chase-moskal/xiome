
import Stripe from "stripe"

export function stripeResponse<xResource>(resource: xResource): Stripe.Response<xResource> {
	return {
		headers: {},
		lastResponse: undefined,
		...resource,
	}
}
