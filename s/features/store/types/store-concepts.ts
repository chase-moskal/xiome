
import {Policy} from "renraku/x/types/primitives/policy.js"

import {DamnId} from "../../../toolbox/damnedb/damn-id.js"
import {SecretConfig} from "../../../assembly/backend/types/secret-config.js"
import {StoreAuth, StoreLinkedAuth, StoreMeta} from "./store-metas-and-auths.js"

export interface StoreApiOptions {
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

export interface StoreServiceOptions extends StoreApiOptions {
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
