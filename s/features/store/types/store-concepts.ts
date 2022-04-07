
import * as dbmage from "dbmage"
import * as renraku from "renraku"

import {CardClues} from "../stripe/liaison/types/card-clues.js"
import {makeStripeLiaison} from "../stripe/liaison/stripe-liaison.js"
import {SecretConfig} from "../../../assembly/backend/types/secret-config.js"
import {prepareAuthPolicies} from "../../auth/policies/prepare-auth-policies.js"
import {StoreAuth, StoreCustomerAuth, StoreLinkedAuth, StoreMeta} from "./store-metas-and-auths.js"

export type StripeLiaison = ReturnType<typeof makeStripeLiaison>
export type StripeLiaisonAccount = ReturnType<
	ReturnType<typeof makeStripeLiaison>["account"]
>

export interface StoreCommonOptions {
	config: SecretConfig
	accountReturningLinks: {
		refresh: string
		return: string
	}
	checkoutReturningLinks: {
		cancel: string
		success: string
	}
	generateId: () => dbmage.Id
}

export interface StoreApiOptions extends StoreCommonOptions {
	stripeLiaison: StripeLiaison
	authPolicies: ReturnType<typeof prepareAuthPolicies>
}

export interface StoreServiceOptions extends StoreCommonOptions {
	storePolicy: renraku.Policy<StoreMeta, StoreAuth>
	storeLinkedPolicy: renraku.Policy<StoreMeta, StoreLinkedAuth>
	storeCustomerPolicy: renraku.Policy<StoreMeta, StoreCustomerAuth>
}

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

export interface SubscriptionTier {
	tierId: string
	label: string
	roleId: string
	price: number
	time: number
	active: boolean
}

export interface SubscriptionPlan {
	planId: string
	label: string
	roleId: string
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
	tierIds: string[]
}

export interface PaymentMethod {
	cardClues: CardClues
}
