
import {Stripe} from "stripe"

export interface MinimalCard extends Partial<Stripe.PaymentMethod.Card> {
	brand: string,
	last4: string,
	country: string,
	exp_year: number,
	exp_month: number,
}
