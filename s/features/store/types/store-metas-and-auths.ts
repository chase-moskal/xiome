
import {AnonAuth, AnonMeta} from "../../auth/types/auth-metas.js"
import {StripeLiaison, StripeLiaisonAccount} from "./store-concepts.js"

export interface StoreMeta extends AnonMeta {}

export interface StoreAuth extends AnonAuth {
	stripeLiaison: StripeLiaison
}

export interface StoreLinkedAuth extends StoreAuth {
	stripeAccountId: string
	stripeLiaisonAccount: StripeLiaisonAccount
}

export interface StoreCustomerAuth extends StoreLinkedAuth {
	stripeCustomerId: string
}
