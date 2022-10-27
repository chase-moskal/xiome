
import {CardClues} from "../backend/stripe/liaison/types.js"

export enum StripeConnectStatus {
	Unlinked,
	Incomplete,
	Paused,
	Ready,
}

export interface StripeConnectDetails {
	userId: string
	stripeAccountId: string
	email: string
	charges_enabled: boolean
	payouts_enabled: boolean
	details_submitted: boolean
	timeLinked: number
	paused: boolean
}

export interface SubscriptionPricing {
	stripePriceId: string
	price: number
	currency: "usd"
	interval: "month" | "year"
}

export interface SubscriptionTier {
	tierId: string
	label: string
	roleId: string
	time: number
	active: boolean
	pricing?: SubscriptionPricing[]
}

export interface SubscriptionPlan {
	planId: string
	label: string
	tiers: SubscriptionTier[]
	time: number
	archived: boolean
}

export enum SubscriptionStatus {
	Unsubscribed,
	Active,
	Unpaid,
	Cancelled,
}

export interface SubscriptionDetails {
	status: SubscriptionStatus
	planId: string
	tierId: string
	pricing: SubscriptionPricing
}

export interface PaymentMethod {
	cardClues: CardClues
}

export enum PurchaseScenario {
	Update,
	UsePaymentMethod,
	CheckoutPopup,
}
