
import {Stripe} from "stripe"

import {StoreTables} from "../../tables/types/store-tables.js"
import {DamnId} from "../../../../../toolbox/damnedb/damn-id.js"
import {AuthTables} from "../../../../auth/types/auth-tables.js"
import {StripeLiaisonForApp} from "../../../stripe2/types/stripe-liaison-app.js"
import {StripeLiaisonForPlatform} from "../../../stripe2/types/stripe-liaison-for-platform.js"
import {AnonAuth, AnonMeta, AppOwnerAuth, AppOwnerMeta, UserAuth, UserMeta} from "../../../../auth/types/auth-metas.js"

export interface MerchantMeta extends AppOwnerMeta {}
export interface MerchantAuth extends AppOwnerAuth {
	stripeLiaisonForPlatform: StripeLiaisonForPlatform
	authorizeMerchantForApp(appId: DamnId): Promise<{
		authTables: AuthTables
		storeTables: StoreTables
	}>
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
	stripeLiaisonForApp: StripeLiaisonForApp
}

export interface ClerkMeta extends CustomerMeta {}
export interface ClerkAuth extends CustomerAuth {}
