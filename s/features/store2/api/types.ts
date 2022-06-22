
import * as dbmage from "dbmage"
import * as renraku from "renraku"

import {AnonAuth, AnonMeta} from "../../auth/types/auth-metas.js"
import {SecretConfig} from "../../../assembly/backend/types/secret-config.js"
import {StripeLiaison, StripeLiaisonAccount} from "../stripe/liaison/types.js"
import {StoreDatabase} from "../types/store-schema.js"
import {makeStorePolicies} from "./policies/store-policies.js"
import {PermissionsInteractions} from "../interactions/interactions-types.js"

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
	stripeLiaison: StripeLiaison
	generateId: () => dbmage.Id
	anonPolicy: renraku.Policy<AnonMeta, AnonAuth>
}

export interface StoreServiceOptions extends StoreApiOptions {
	storePolicies: ReturnType<typeof makeStorePolicies>
}

export interface StoreMeta extends AnonMeta {}

export interface StoreAuth extends Omit<AnonAuth, "database"> {
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

