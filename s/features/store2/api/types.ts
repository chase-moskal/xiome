
import * as dbmage from "dbmage"
import * as renraku from "renraku"

// import {AnonAuth, AnonMeta} from "../../auth/types/auth-metas.js"
import {StoreDatabase} from "../types/store-schema.js"
import {AccessPayload} from "../../auth/types/auth-tokens.js"
import {makeStorePolicies} from "./policies/store-policies.js"
import {PermissionsInteractions} from "../interactions/interactions-types.js"
import {StripeLiaison, StripeLiaisonAccount} from "../stripe/liaison/types.js"

export interface StoreApiOptions<xStoreMeta> {
	accountReturningLinks: {
		refresh: string
		return: string
	}
	checkoutReturningLinks: {
		cancel: string
		success: string
	}
	stripeLiaison: StripeLiaison
	generateId: () => dbmage.Id
	storePolicy: renraku.Policy<xStoreMeta, StoreAuth>
}

export interface StoreServiceOptions<xStoreMeta = any> extends StoreApiOptions<xStoreMeta> {
	storePolicies: ReturnType<typeof makeStorePolicies>
}

export interface StoreAuth {
	access: AccessPayload
	stripeLiaison: StripeLiaison
	storeDatabase: StoreDatabase
	permissionsInteractions: PermissionsInteractions
}

export interface StoreLinkedAuth extends StoreAuth {
	stripeAccountId: string
	stripeLiaisonAccount: StripeLiaisonAccount
}

export interface StoreCustomerAuth extends StoreLinkedAuth {
	stripeCustomerId: string
}

