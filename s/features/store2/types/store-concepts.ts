
// StripeLiaison
// StripeLiaisonAccount

import {CardClues} from "../stripe/liaison/types.js"

// CardClues

export enum StripeConnectStatus {
	Unlinked,
	Incomplete,
	Paused,
	Ready,
}

export interface StripeConnectDetails {
	stripeAccountId: string
	email: string
	charges_enabled: boolean
	payouts_enabled: boolean
	details_submitted: boolean
	timeLinked: number
	paused: boolean
}

export interface SubscriptionPricing {
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
	pricing: SubscriptionPricing
}

export interface SubscriptionPlan {
	planId: string
	label: string
	tiers: SubscriptionTier[]
	time: number
	active: boolean
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
}

export interface PaymentMethod {
	cardClues: CardClues
}
