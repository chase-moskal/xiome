
import {Stripe} from "stripe"
import {FlexibleRow} from "./custom-db/flexible-row.js"

export type MockPaymentMethod = FlexibleRow<{
	id: string
	card: Stripe.PaymentMethod.Card
} & Partial<Stripe.PaymentMethod>>
