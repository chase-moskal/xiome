
import * as dbmage from "dbmage"
import * as renraku from "renraku"

// import {AnonAuth, AnonMeta} from "../../auth/types/auth-metas.js"
import {StoreDatabase} from "../types/store-schema.js"
import {AccessPayload} from "../../auth/types/auth-tokens.js"
import {makeStorePolicies} from "./policies/store-policies.js"
import {PermissionsInteractions} from "../interactions/interactions-types.js"
import {StripeLiaison, StripeLiaisonAccount} from "../stripe/liaison/types.js"
import {PrivilegeChecker} from "../../auth/aspects/permissions/types/privilege-checker.js"
import {appPermissions} from "../../../assembly/backend/permissions/standard-permissions.js"
import {AnonAuth, AnonMeta} from "../../auth/types/auth-metas.js"

export interface StoreApiOptions<xMeta = any> {
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
	storePolicy: renraku.Policy<xMeta, StoreAuth>
}

export interface StoreServiceOptions<xMeta = any> extends StoreApiOptions<xMeta> {
	storePolicies: ReturnType<typeof makeStorePolicies>
}

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

