
import {Stripe} from "stripe"

import {StoreTables} from "../../tables/types/store-tables.js"
import {AuthTables} from "../../../../auth/types/auth-tables.js"
import {makeStripeLiaison} from "../../../stripe2/liaison/stripe-liaison.js"
import {AnonAuth, AnonMeta, UserAuth, UserMeta} from "../../../../auth/types/auth-metas.js"

export interface StoreMeta extends AnonMeta {}
export interface StoreAuth extends AnonAuth {
	storeTables: StoreTables
	stripeLiaison: ReturnType<typeof makeStripeLiaison>
}
export interface StoreLinkedAuth extends StoreAuth {
	stripeLiaisonAccount: ReturnType<
		ReturnType<typeof makeStripeLiaison>["account"]
	>
}

export interface MerchantMeta extends UserMeta {}
export interface MerchantAuth extends UserAuth {
	authTables: AuthTables
	storeTables: StoreTables
	stripeLiaison: ReturnType<typeof makeStripeLiaison>
}

export interface ProspectMeta extends AnonMeta {}
export interface ProspectAuth extends AnonAuth {
	authTables: AuthTables
	storeTables: StoreTables
	getStripeAccount(id: string): Promise<Stripe.Account>
}

export interface CustomerMeta extends UserMeta {}
export interface CustomerAuth extends UserAuth {
	storeTables: StoreTables
	stripeLiaisonAccount: ReturnType<ReturnType<typeof makeStripeLiaison>["account"]>
}

export interface ClerkMeta extends CustomerMeta {}
export interface ClerkAuth extends CustomerAuth {}
