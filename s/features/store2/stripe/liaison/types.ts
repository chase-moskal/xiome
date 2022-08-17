
import {Stripe} from "stripe"
import {makeStripeLiaison} from "./stripe-liaison.js"
import {prepareMockStripeOperations} from "../utils/prepare-mock-stripe-operations.js"

export type StripeLiaison = ReturnType<typeof makeStripeLiaison>
export type StripeLiaisonAccount = ReturnType<StripeLiaison["account"]>

export type CardClues = {
	brand: string
	last4: string
	country: string
	expireYear: number
	expireMonth: number
}

export interface MinimalCard extends Partial<Stripe.PaymentMethod.Card> {
	brand: string,
	last4: string,
	country: string,
	exp_year: number,
	exp_month: number,
}

export interface PaymentDetails {
	card: CardClues
	stripePaymentMethodId: string
}

export type SetupDefaultPaymentsMetadata = {
	flow: "update-default-payments"
	customer_id: string
} & Stripe.Metadata

export type SetupSubscriptionMetadata = {
	flow: "update-subscription"
	customer_id: string
	subscription_id: string
} & Stripe.Metadata

export interface SubscriptionDetails {
	id: string
	status: Stripe.Subscription.Status
	current_period_end: number
	productIds: string[]
}
