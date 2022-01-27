
import * as renraku from "renraku"
import {Id} from "dbmage"

import {AnonAuth, AnonMeta} from "../../auth/types/auth-metas.js"
import {makeStripeLiaison} from "../stripe/liaison/stripe-liaison.js"
import {SecretConfig} from "../../../assembly/backend/types/secret-config.js"
import {StoreAuth, StoreLinkedAuth, StoreMeta} from "./store-metas-and-auths.js"

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
	generateId: () => Id
}

export interface StoreApiOptions extends StoreCommonOptions {
	stripeLiaison: StripeLiaison
	basePolicy: renraku.Policy<AnonMeta, AnonAuth>
}

export interface StoreServiceOptions extends StoreCommonOptions {
	storePolicy: renraku.Policy<StoreMeta, StoreAuth>
	storeLinkedPolicy: renraku.Policy<StoreMeta, StoreLinkedAuth>
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
	price: number
	time: number
	active: boolean
}

export interface SubscriptionPlan {
	planId: string
	label: string
	tiers: SubscriptionTier[]
	time: number
	active: boolean
}
