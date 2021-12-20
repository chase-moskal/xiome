
import {RenrakuPolicy} from "renraku"

import {StoreTables} from "./store-tables.js"
import {DamnId} from "../../../toolbox/damnedb/damn-id.js"
import {AnonAuth, AnonMeta} from "../../auth/types/auth-metas.js"
import {makeStripeLiaison} from "../stripe/liaison/stripe-liaison.js"
import {SecretConfig} from "../../../assembly/backend/types/secret-config.js"
import {StoreAuth, StoreLinkedAuth, StoreMeta} from "./store-metas-and-auths.js"
import {UnconstrainedTables} from "../../../framework/api/types/table-namespacing-for-apps.js"

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
	generateId: () => DamnId
}

export interface StoreApiOptions extends StoreCommonOptions {
	stripeLiaison: StripeLiaison
	storeTables: UnconstrainedTables<StoreTables>
	basePolicy: RenrakuPolicy<AnonMeta, AnonAuth>
}

export interface StoreServiceOptions extends StoreCommonOptions {
	storePolicy: RenrakuPolicy<StoreMeta, StoreAuth>
	storeLinkedPolicy: RenrakuPolicy<StoreMeta, StoreLinkedAuth>
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
