
import {Stripe} from "stripe"
import {FlexibleDbbyRow} from "./dbby-bespoke/flexible-dbby-row.js"

export type MockPaymentMethod = {
	id: string
	card: Stripe.PaymentMethod.Card
} & Partial<Stripe.PaymentMethod> & FlexibleDbbyRow
