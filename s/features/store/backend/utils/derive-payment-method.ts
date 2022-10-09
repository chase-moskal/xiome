
import Stripe from "stripe"
import {PaymentMethod} from "../../isomorphic/concepts.js"

export function derivePaymentMethod(
		method: Stripe.PaymentMethod | undefined
	): PaymentMethod {

	const {card} = method ?? {}

	return card
		? {
			cardClues: {
				brand: card.brand,
				country: card.country,
				expireMonth: card.exp_month,
				expireYear: card.exp_year,
				last4: card.last4,
			},
		}
		: undefined
}
