
import {MinimalCard} from "../types/minimal-card.js"
import {PaymentDetails} from "../types/payment-details.js"

export const toPaymentDetails = ({id, card}: {
		id: string
		card?: MinimalCard
	}): PaymentDetails => ({

	stripePaymentMethodId: id,
	card: card && {
		brand: card.brand,
		last4: card.last4,
		country: card.country,
		expireYear: card.exp_year,
		expireMonth: card.exp_month,
	},
})
