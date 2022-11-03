
import * as dbmage from "dbmage"

import {AnonAuth} from "../../../auth/types/auth-metas.js"
import {StripeLiaison, StripeLiaisonAccount} from "../stripe/liaison/types.js"
import {RoleManager} from "../../../auth/aspects/permissions/interactions/types.js"
import {StoreDatabase, StoreDatabaseUnconnected} from "../database/types/schema.js"

export interface StoreAuth extends Omit<AnonAuth, "database"> {
	stripeLiaison: StripeLiaison
	roleManager: RoleManager
	storeDatabaseUnconnected: StoreDatabaseUnconnected
}

export interface StoreConnectedAuth extends StoreAuth {
	stripeAccountId: string
	stripeLiaisonAccount: StripeLiaisonAccount
	storeDatabase: StoreDatabase
}

export interface StoreCustomerAuth extends StoreConnectedAuth {
	stripeCustomerId: string
}
