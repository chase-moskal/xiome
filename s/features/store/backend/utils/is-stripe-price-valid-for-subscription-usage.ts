
import Stripe from "stripe"

export function isStripePriceValidForSubscriptionUsage(
		stripePrice: Stripe.Price
	) {

	const conditions = [
		(stripePrice?.active),
		(stripePrice?.recurring),
		(stripePrice?.recurring?.usage_type === "licensed"),
		(
			stripePrice?.recurring?.interval === "month" ||
			stripePrice?.recurring?.interval === "year"
		),
	]

	const failure = conditions.some(condition => !condition)
	return !failure
}
