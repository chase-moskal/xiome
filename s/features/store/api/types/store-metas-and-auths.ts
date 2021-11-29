
import {StoreTables} from "./store-tables.js"
import {AnonAuth, AnonMeta} from "../../../auth/types/auth-metas.js"
import {makeStripeLiaison} from "../../stripe2/liaison/stripe-liaison.js"

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
