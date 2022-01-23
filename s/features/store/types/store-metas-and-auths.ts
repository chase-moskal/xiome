
import {StoreSchema} from "./store-schema.js"
import {AnonAuth, AnonMeta} from "../../auth/types/auth-metas.js"
import {StripeLiaison, StripeLiaisonAccount} from "./store-concepts.js"

export interface StoreMeta extends AnonMeta {}

export interface StoreAuth extends AnonAuth {
	storeTables: StoreSchema
	stripeLiaison: StripeLiaison
}

export interface StoreLinkedAuth extends StoreAuth {
	stripeAccountId: string
	stripeLiaisonAccount: StripeLiaisonAccount
}
