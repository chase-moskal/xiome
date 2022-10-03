
import {StoreDatabase} from "../database/types/schema.js"
import {AnonAuth} from "../../../auth/types/auth-metas.js"
import {StripeLiaison, StripeLiaisonAccount} from "../stripe/liaison/types.js"
import {RoleManager} from "../../../auth/aspects/permissions/interactions/types.js"

export interface StoreAuth extends Omit<AnonAuth, "database"> {
	stripeLiaison: StripeLiaison
	storeDatabase: StoreDatabase
	roleManager: RoleManager
}

export interface StoreLinkedAuth extends StoreAuth {
	stripeAccountId: string
	stripeLiaisonAccount: StripeLiaisonAccount
}

export interface StoreCustomerAuth extends StoreLinkedAuth {
	stripeCustomerId: string
}
