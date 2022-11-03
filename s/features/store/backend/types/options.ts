
import * as dbmage from "dbmage"
import * as renraku from "renraku"

import {StoreAuth} from "../policies/types.js"
import {StripeLiaison} from "../stripe/liaison/types.js"
import {makeStorePolicies} from "../policies/policies.js"

export interface StoreApiOptions<xMeta = any> {
	popupReturnUrl: string
	stripeLiaison: StripeLiaison
	generateId: () => dbmage.Id
	anonPolicy: renraku.Policy<xMeta, StoreAuth>
}

export interface StoreServiceOptions<xMeta = any> extends StoreApiOptions<xMeta> {
	storePolicies: ReturnType<typeof makeStorePolicies>
}
