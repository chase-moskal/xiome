
import * as dbmage from "dbmage"
import * as renraku from "renraku"

import {StoreAuth} from "./policies/types.js"
import {StripeLiaison} from "./stripe/liaison/types.js"
import {makeStorePolicies} from "./policies/policies.js"

export interface StoreApiOptions<xMeta = any> {
	popupReturnUrl: string
	stripeLiaison: StripeLiaison
	generateId: () => dbmage.Id
	storePolicy: renraku.Policy<xMeta, StoreAuth>
}

export interface StoreServiceOptions<xMeta = any> extends StoreApiOptions<xMeta> {
	storePolicies: ReturnType<typeof makeStorePolicies>
}

// TODO does this belong in the popups folder or something?
export interface CheckoutPopupDetails {
	popupId: string
	stripeAccountId: string
	stripeSessionUrl: string
	stripeSessionId: string
}
