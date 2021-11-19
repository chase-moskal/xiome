
import {Policy} from "renraku/x/types/primitives/policy.js"

import {DamnId} from "../../../../toolbox/damnedb/damn-id.js"
import {SecretConfig} from "../../../../assembly/backend/types/secret-config.js"
import {StoreAuth, StoreLinkedAuth, StoreMeta} from "../policies/types/store-metas-and-auths.js"

export interface StoreCommonOptions {
	config: SecretConfig
	accountReturningLinks: {
		refresh: string
		return: string
	}
	checkoutReturningLinks: {
		cancel: string
		success: string
	}
	generateId: () => DamnId
}

export interface StoreServiceOptions extends StoreCommonOptions {
	storePolicy: Policy<StoreMeta, StoreAuth>
	storeLinkedPolicy: Policy<StoreMeta, StoreLinkedAuth>
}
