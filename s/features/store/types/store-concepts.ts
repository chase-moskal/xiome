
import {Policy} from "renraku/x/types/primitives/policy.js"

import {StoreTables} from "./store-tables.js"
import {DamnId} from "../../../toolbox/damnedb/damn-id.js"
import {AnonAuth, AnonMeta} from "../../auth/types/auth-metas.js"
import {makeStripeLiaison} from "../stripe/liaison/stripe-liaison.js"
import {SecretConfig} from "../../../assembly/backend/types/secret-config.js"
import {StoreAuth, StoreLinkedAuth, StoreMeta} from "./store-metas-and-auths.js"
import {UnconstrainedTables} from "../../../framework/api/types/table-namespacing-for-apps.js"

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
	storeTables: UnconstrainedTables<StoreTables>
	stripeLiaison: ReturnType<typeof makeStripeLiaison>
	basePolicy: Policy<AnonMeta, AnonAuth>
}

export interface StoreServiceOptions extends StoreCommonOptions {
	storePolicy: Policy<StoreMeta, StoreAuth>
	storeLinkedPolicy: Policy<StoreMeta, StoreLinkedAuth>
}

export enum StripeConnectStatus {
	Unlinked,
	LinkedButNotReady,
	Ready,
}

export interface StripeConnectDetails {
	stripeAccountId: string
	email: string
	payouts_enabled: boolean
	details_submitted: boolean
	timeLinked: number
}
