
import Stripe from "stripe"
import {DbbyRow} from "../../../../../../toolbox/dbby/dbby-types.js"

export type MockPaymentMethod = DbbyRow & Partial<Stripe.PaymentMethod> & {
	id: string
	card: Stripe.PaymentMethod.Card
}
